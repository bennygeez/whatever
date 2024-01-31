const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config({ path: "./src/config/config.env" });
const { createTransport } = nodemailer;

const sendMail =  (email, subject, text) => {
return new Promise(async(resolve,reject)=>{
   const transport = createTransport(
     sendgridTransport({
       auth: {
         api_key: process.env.NODEMAILER_API_KEY,
       },
     })
   );
   await transport.sendMail({
     from: "info@rmstechknowledgy.com",
     to: email,
     subject,
     text,
   })
   .then((result)=>{
    resolve(result)
   }).catch((err)=>{
    reject(err)
   })

 })

  console.log("🚀 ~ file: sendMail.js:8 ~ sendMail ~ email, subject, text:", email, subject, text)
};

module.exports = sendMail;
