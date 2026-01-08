import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { sendMail } from "@/server/send-mail";
import Email from "@/emails/template";
import { getMonth } from "date-fns";
import { tr } from "date-fns/locale";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TableColumnsSplit } from "lucide-react";

export const checkBudget = inngest.createFunction(
  { name: "check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                }
              }
            }
          }
        }
      })
    })

    for (const budget of budgets) {
      const defaultAcc = budget.user.accounts[0];
      if (!defaultAcc) continue;

      await step.run(`check-budget-${budget.id}`, async () => {

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAcc.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,

            },
          },
          _sum: {
            amount: true,
          }
        })
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentage = (totalExpenses / budgetAmount) * 100;


        if (percentage >= 80 &&
          (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {

          try {
            await sendMail({
              to: budget.user.email,
              subject: `Budget Alert for ${defaultAcc.name}`,
              react: Email({
                userName: budget.user.name,
                type: "budget-alert",
                data: {
                  percentage,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAcc.name,
                }
              })
            })
            console.log("mail sent")
          } catch (err) {
            console.error("sent failed", err)
          }



          await db.budget.update({
            where: {
              id: budget.id,
            },
            data: { lastAlertSent: new Date() },
          });
        }

      });
    }
  }
);

function isNewMonth(lastAlertSent, currDate) {
  return (
    lastAlertSent.getMonth() != currDate.getMonth() || lastAlertSent.getFullYear() !== currDate.getFullYear()
  )

}


export const triggerRecurringTransactions = inngest.createFunction({
  id: "trigger-recurring-transactions",
  name: "Trigger Recurring Transactions",
}, { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    if (recurringTransactions.length > 0) {
      const event = recurringTransactions.map((tx) => ({
        name: "transaction-recurring-process",
        data: { transactionId: tx.id, userId: tx.userId }
      }));

      await inngest.send(event);
    }
    return { triggered: recurringTransactions.length };

  });


export const proccessRecurringTransactions = inngest.createFunction({
  id: "transaction-recurring-process",
  throttle: {
    limit: 10,
    period: "1m",
    key: "event.data.userId",

  },
}, { event: "transaction-recurring-process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data", event);
      return { error: "Missing required event data " }
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      await db.$transaction(async (prisma) => {
        await prisma.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        const balance = transaction.type === "EXPENSE"
          ? -transaction.amount.toNumber() : transaction.amount.toNumber();

        await prisma.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balance } },
        });

        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });

      });
    });
  }
);


function isTransactionDue(tx) {
  if (!tx.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(tx.nextRecurringDate);

  return nextDue <= today;
}


function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.getFullYear(date.getFullYear() + 1);
      break

  }
  return date;
}  

export const monthlyReports = inngest.createFunction({
  id: "monthly-reports",
  name: "Send Monthly Reports",
},{cron: "0 0 1 * *"},
  async ({ step }) => {
    const users = await step.run("fetch-users", async() => {
      return await db.user.findMany({
        include: { accounts: true }, 
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStatsForUser(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });
 
        const insights = await generateInsights(stats, monthName);

      await sendMail({
              to: user.email,
              subject: `Your Monthly Financial Report ${monthName}`,
              react: Email({
                userName: user.name,
                type: "monthly-report",
                data: {
                  stats,
                  month: monthName,
                  insights,
            }
          })
        });
      });
      console.log("Monthly report sent to", user.email);
    }

    return { processed: users.length };
  }
);


async function generateInsights(stats, monthName){
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("GeMINI",process.env.GEMINI_API_KEY?.length);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${monthName}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.categoryBreakdown)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  const result = await model.generateContent(prompt);
  const response =  result.response;
  const text = response.text();

 
const match = text.match(/\[[\s\S]*?\]/);

if (!match) {
  throw new Error("Gemini did not return a JSON array");
}

return JSON.parse(match[0]);

}

const getMonthlyStatsForUser = async(userId, date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() +1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      }
    }
  });
    return transactions.reduce(
      (stats,tx) => {
        const amount = tx.amount.toNumber();
        if(tx.type === "EXPENSE"){
          stats.totalExpenses += amount;
          stats.categoryBreakdown[tx.category] = (stats.categoryBreakdown[tx.category] || 0) + amount;
        }else{
          stats.totalIncome += amount;
        }
        return stats;
      },
      {
        totalExpenses: 0,
        totalIncome: 0,
        categoryBreakdown: {},  
        transactionsCount: transactions.length,
      }
    )


}