import mailTransport from "../config/nodemailer.config.js";

export const sendEmail = async(to,subject,text,html)=>{
    const sendMail = await mailTransport.sendMail({
        from:"kumarabhay03889@gmail.com",
        to,
        subject,
        text,
        html,
    });
    console.log(sendEmail);
    return sendMail;
}