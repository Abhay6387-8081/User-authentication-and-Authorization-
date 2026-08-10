import nodemailer from "nodemailer";

const mailTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    // service:process.env.NODEMAILER_SERVICE,
    auth:{
        user:"kumarabhay03889@gmail.com",
        pass:"lcyj obwg cuon zhoz",
    }
    
});
// console.log(port);
export default mailTransport;