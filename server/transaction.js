"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serialize = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),

})
export async function addTransaction(data){
    try {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            
            const req = await request();

            const decision = await aj.protect(req, {
                userId,
                requested:1
            })

            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    const { remaining, reset } = decision.reason;
                    console.error({
                        code: "RATE_LIMIT_EXCEEDED",
                        details:{
                            remaining,
                            resetInseconds: reset,
                        }
                    })

                    throw new Error("Too many requests. Please try again later.")
                }
                    throw new Error("Request Blocked")
            }

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
            const newTransaction = await tx.transaction.create({
                data:{
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ?calculateNextRecurringDate(data.date, data.recurringInterval):null,
                }
            });

            await tx.account.update({
                where:{ id: data.accountId },
                data: {balance: newBalance},
            })
            return newTransaction;

        })

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data:serialize(transaction)}
        }catch(err){
            throw new Error(err.message);
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
    return date;
 }  

 export async function scanreceipt(file) {
    try{
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"})

        const arrayBuffer = await file.arrayBuffer();
        
        const base64String = Buffer.from(arrayBuffer).toString("base64")

        const prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object`;
const contents = [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            data: base64String,
                            mimeType: file.type,
                        },
                    },
                    { text: prompt },
                ]
            },
        ];
        
        const res = await model.generateContent({
            contents: contents,
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        
        // --- FIXES START HERE ---
        
        // 1. More robust check: The SDK places the final generated text on the 'text' property.
        // It should be available if the API call was successful.
        const text = res.text; 
        
        if (!text) {
            // Check if the model blocked the response (e.g., for safety)
            if (res.candidates && res.candidates.length > 0 && res.candidates[0].finishReason === 'SAFETY') {
                console.error("Gemini API blocked the response due to safety settings.");
                throw new Error("Content was blocked by safety settings.");
            }
            // If the response is empty and not blocked, it's a general processing failure.
            throw new Error("No text returned from Gemini. Image processing failed or response was empty.");
        }

        const cleanedText = text.trim(); 
        
        // 2. Safety check for the empty object return
        if (cleanedText === '{}' || cleanedText === '[]') {
             console.log("Gemini returned an empty object, indicating the image was not a receipt.");
             return {}; // Return an empty object to the client
        }

         try{
            const data = JSON.parse(cleanedText);
            return{
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            }
         }catch(err){
            console.error("Error parsing JSON response:", err);
            throw new Error("Invalid response format from Gemini")
         }
    }
   
    catch(err){
        console.error("Error Scanning receipt:", err.message);
        throw new Error("Falied to Scan receipt")
    }
 }      