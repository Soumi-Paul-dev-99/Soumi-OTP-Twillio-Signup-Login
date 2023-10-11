const express = require ("express");
const dotenv = require("dotenv").config();
const app = express();
const userRoute = require("./routes/userRoutes");
const port = process.env.PORT || 5000 
const connectDB = require("./config/db");
const User = require("./models/userModel");
 const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
connectDB();
const auth = require("./middleware/auth")
app.use(express.json())
app.use(
    express.urlencoded({
      extended: true,
    }))
app.use("/api",userRoute);

app.get("/", (req,res)=>{
    // sendTestMessage()
    res.send("get method called");
});

app.post("/welcome",auth,(req,res)=>{
    res.status(200).send("welcome 🙌")
})

// function sendTestMessage(){
//     client.messages
//     .create({
//       body: 'Hello from twilio-node',
//       to: '+919330719639', // Text your number
//       from: '+919163177924', // From a valid Twilio number
//     })
//     .then((message) => console.log(message.sid));
// }

// // Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

//twilio verification code sending process
// const accountSid = "ACa22b4d8cdbc0f3fb8007541778518f86";
// const authToken = "680404ca511a6c89460bcef8bb614a8c";
// const verifySid = "VA34132cb9205955fb3b2438b6074a17f3";
// const client = require("twilio")(accountSid, authToken);

// function sendTestMessage(){client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+919330719639", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+919330719639", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });
// }

module.exports = app;
