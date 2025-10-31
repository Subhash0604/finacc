import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { sendMail } from "@/server/send-mail";
import Email from "@/emails/template";

export const checkBudget = inngest.createFunction(
  { name: "check Budget Alerts"},
  {cron: "0 */6 * * *" },
  async({step}) => {
    const budgets = await step.run("fetch budget", async() => {
        return await db.budget.findMany({
           include: {
            user: {
              include:{
                accounts:{
                  where: {
                    isDefault: true,
                  }
                }
              }
            }
           }
        })
    })

    for(const budget of budgets){
      const defaultAcc = budget.user.accounts[0];
         if(!defaultAcc) continue;

         await step.run(`check-budget-${budget.id}`,async () => {

          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
           const expenses = await db.transaction.aggregate({
            where: {
                userId: budget.userId,
                accountId: defaultAcc.id,
                type: "EXPENSE",
                date:{
                     gte: startOfMonth,
                     lte: endOfMonth,
                    
            },
           } ,
           _sum:{
            amount:true,
           } 
           })
           const totalExpenses = expenses._sum.amount?.toNumber() || 0;
           const budgetAmount = budget.amount;
           const percentage = (totalExpenses / budgetAmount) * 100;

  
           if(percentage >= 80 && 
            (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent),new Date()))){
              
              try{
                   await sendMail({
                to: budget.user.email,
                subject: `Budget Alert for ${defaultAcc.name}`,
                react: Email({
                  userName: budget.user.name,
                  type: "budget-alert",
                  data:{
                    percentage,
                    budgetAmount: parseInt(budgetAmount).toFixed(1),
                    totalExpenses: parseInt(totalExpenses).toFixed(1),
                    accountName: defaultAcc.name,
                  }
                })
              })
              console.log("mail sent")
              }catch(err){
                  console.error("sent failed",err)
              }
             


              await db.budget.update({
                where: {
                  id: budget.id,
                },
                data:{ lastAlertSent: new Date() },
              });
            }

         });
    }
  }
);

function isNewMonth(lastAlertSent, currDate){
  return (
       lastAlertSent.getMonth() != currDate.getMonth() || lastAlertSent.getFullYear() !== currDate.getFullYear() 
  )
   
}
