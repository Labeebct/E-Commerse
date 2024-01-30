const nodemailer = require("nodemailer");

const sendingEmail = process.env.GMAIL
const appPassword = process.env.APP_PASSWORD



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sendingEmail ,
    pass: appPassword,
  },
});



async function emailOtp(userMail) {

   try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: userMail,
        subject: "OTP Verification",
        text: `Your OTP for changing password is 1354 `

      });

      console.log("Message sent:", info.messageId);
        
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = emailOtp