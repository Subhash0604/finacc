 import { Description } from "@radix-ui/react-dialog";
import z from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.string().min(1, "Intial Balance is required"),
    isDefault: z.boolean().default(false),
})

export const transactionSchema = z.object({
   type: z.enum(["INCOME", "EXPENSE"]),
   amount: z.string().min(1, "Amount is required"),
   description: z.string().optional(),
   data: z.date({ required_error: "Data is required"}),
   accountId: z.string().min(1, "Account id required"),
   category: z.string().min(1, "Category is required"),
   isRecurring: z.boolean().default(false),
   recurringInterval: z.enum(["DAILY", "WEEKLY","MONTHLY","YEARLY"]).optional(),
}).superRefine((data,ctx) => {
    if(data.isRecurring && !data.recurringInterval){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring interval is required for recurring transaction",
            path: ["recurringInterval"]
        })
    }
})

//find bug 