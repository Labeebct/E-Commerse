const nodemailer = require("nodemailer");

const otp = Math.round(Math.random() * 10000)



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
        subject: "Password Change Confirmation: Your One-Time Passcode (OTP)",
        text: `
           Dear ${userMail},

          We've received a request to change your password for your LABIO account. To ensure the security of this process, we've generated a one-time passcode (OTP) for you.

          Your OTP for changing your password is: ${otp}

          Please safeguard this OTP and avoid sharing it with anyone. It's crucial for completing the password change process securely.

          If you didn't initiate this password change request or have any concerns, please contact our support team immediately at [support email].

          Thank you for your attention to this matter.

          Best regards,

          [Your Name]
          LABIO Support Team
         `

      });
      
      console.log(`${otp} otp send to ${userMail}`);

  
    } catch (error) {
        console.log(error.message);
    }
}



const verify = (postOtp,res,req) => {

    if(otp === parseInt(postOtp)){
      res.redirect('/change_password')
    }
    else{
        req.flash('incorrect','Incorrect OTP')
        res.redirect('/email_otp')
    }

}



module.exports = {emailOtp , verify}