import { seedTransactions  } from "@/server/seed";  


export async function GET(){
   const res = await seedTransactions()
   
   return Response.json(res);
}