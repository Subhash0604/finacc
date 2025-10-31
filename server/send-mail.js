import { render } from "@react-email/render";
import { Resend } from "resend";


export async function sendMail({ to, subject, react}){

    const resend = new Resend(process.env.RESEND_API_KEY || "");
     const html = render(react);
    try{
        const data = await resend.emails.send({
            from:"Finac <no-reply@finac.examples.com>",
            to,
            subject,
            html,
        });

        return {success:true, data}
    }catch(err){
        console.error("Failed to send email:", err)
        return { success:false, err}
    }
}