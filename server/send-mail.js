import { Resend } from "resend";


export async function sendMail({ to, subject, react}){
    const resend = new Resend(process.env.RESEND_API || "");

    try{
        const data = await resend.emails.send({
            from:"Finac <onboarding@resend.dev>",
            to,
            subject,
            react,
        });

        return {success:true, data}
    }catch(err){
        console.error("Failed to send email:", err)
        return { success:false, err}
    }
}