"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createAcc(data) {

    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({

            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("Unauthorized");

        const balance = parseFloat(data.balance);

        if(isNaN(balance)){
            throw new Error("Invalid balance");
        }
        
        const currentAccount = await db.account.findMany({
            where: { userId: user.id},
        })
         
    } catch (err) {

    }
}