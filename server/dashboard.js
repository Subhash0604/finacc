"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { includes } from "zod";



const serialize = (obj) => {
    const serialized = { ...obj };

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    } 
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}


export async function createAcc(data) {

    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({

            where: { clerkUserId: userId }
        });

        if (!user) throw new Error("Unauthorized");

        const balance = parseFloat(data.balance);

        if (isNaN(balance)) {
            throw new Error("Invalid balance");
        }

        const currentAccount = await db.account.findMany({
            where: { userId: user.id },
        })

        // this will make the current account as default if no account exists

        const defaultAcc = currentAccount.length === 0 ? true : data.isDefault;

        // this makes the other accounts as default account as the new account is created as default

        if (defaultAcc) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            })
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balance,
                userId: user.id,
                isDefault: defaultAcc,
            }
        })
        const serializedAcc = serialize(account);

        revalidatePath("/dashboard");

        return { success: true, data: serializedAcc };
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAccounts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({

        where: { clerkUserId: userId }
    });

    if (!user) throw new Error("Unauthorized");
 
    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count:{
                select: {
                    transactions: true
                }
            }
        }
    });

     const serializedAcc = accounts.map(serialize);
     return serializedAcc;
}