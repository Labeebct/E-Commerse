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
        subject: "OTP Verification",
        text: `Your OTP for changing password is ${otp} `

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