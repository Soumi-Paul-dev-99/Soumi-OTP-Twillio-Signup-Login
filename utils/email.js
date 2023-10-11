// import { createTransport } from "nodemailer";
// const nodemailer = require("nodemailer");
const nodemailer = require("nodemailer")


const sendEmail = async (to , subject , text)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // host : process.env.SMTP_HOST,
        // port : process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        to,subject,text
    });
};
module.exports = sendEmail