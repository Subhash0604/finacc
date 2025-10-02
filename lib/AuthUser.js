import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const AuthUser = async()=>{
    const user = await currentUser();

    if(!user) return null;

    try{

        const   loggedUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });

        if(loggedUser){
            return loggedUser
        }
        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl : user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            },
        })

        return newUser;

    } catch(err){
        console.log("error", err.message);
        return null;
    }
};