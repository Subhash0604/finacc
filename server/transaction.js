import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addTransaction(data){
    try {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            

            const user = await db.user.findUnique({
            
                where: { clerkUserId: userId }
            });
            
            if (!user) throw new Error("Unauthorized");
            
             const account = await db.account.findUnique({
                where:{
                    id: data.accountId,
                    userId: user.id,
                },
            });

            if(!account){
                throw new Error("Account not Found")
            }

        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount; 
        const newBalance = account.balance.toNumber() + balanceChange;

        const transaction = await db.$transaction(async (tx) => {
            const newTransaction = await transaction.create({
                data:{
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval?calculateNextRecurringDate(data.date, data.recurringInterval):null,
                }
            });

            await tx.account.update({
                where:{ id: data.accountId },
                data: {balance: newBalance},
            })
            return newTransaction;
        })
        }catch(err){

      }      
}

 function calculateNextRecurringDate(startDate, interval){
    const date = new Date(startDate);

    switch(interval){
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
 }  