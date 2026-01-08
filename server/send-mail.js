import { render } from "@react-email/render";
import { Resend } from "resend";


export async function sendMail({ to, subject, react}){

    const resend = new Resend(process.env.RESEND_API_KEY || "");
     const html = await render(react);
    try{
        const data = await resend.emails.send({
            from:"Finac <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

         if (data.error) {
            console.error("Resend error:", data.error);
            throw new Error(data.error.message);
              }

            console.log("Resend accepted email:", data.data?.id);
            return data.data;

        return {success:true, data}
    }catch(err){
        console.error("Failed to send email:", err)
        return { success:false, err}
    }``
}