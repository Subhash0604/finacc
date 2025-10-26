"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function getBudgetSummary(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({

            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("Unauthorized");
         
    
        const budget = await db.budget.findFirst({
            where:{
                userId: user.id,
            }
        })
    
        const currentDate = new Date();
        const StartOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const totalExpenses = await db.transaction.aggregate({
            where: {
                accountId: accountId,
                type: "expense",
                date: {
                    gte: StartOfMonth,
                    lte: endOfMonth,
                },
                accountId,
            },
            _sum: {
                amount: true,
            },
        });
        return {
            budget: budget? { ...budget, amount: budget.amount.toNumber() } : null,
            totalExpenses: totalExpenses._sum.amount
                ? totalExpenses._sum.amount.toNumber()
                : 0,
        }
    } catch (err) {
        console.error("Error Fetching budget:", err);
        throw err;
    }
}

export async function updateBudget(amount) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({

            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("Unauthorized");

        const budget = await db.budget.upsert({
            where: { userId: user.id },
            update:{
                amount,
            },
            create: {
                userId: user.id,
                amount,
            },
        });
        revalidatePath("/dashboard");
        return { success: true, data: { ...budget, amount: budget.amount.toNumber() } }

    }catch (err){
        console.error("Error updating budget:", err);
        return { success: false, error: err.message }
    }
   
}