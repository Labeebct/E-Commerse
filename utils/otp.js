const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_SERVICE_SID


const client = require('twilio')(accountSID, authToken)
const signupModel = require('../models/signup')


// OTP SENDING


const sendOtp = (num) => {
 
    client.verify.v2.services(serviceSid)
    .verifications
    .create({to: '+91'+ num, channel: 'sms'})
    .then(verification => console.log(verification.status))

}


// OTP VERIFYING


const verifyOtp = async(num,code,res,req) => {

  try {

     const verification_check = await client.verify.v2.services(serviceSid)
        .verificationChecks
        .create({to: '+91'+ num , code: code})

        console.log(verification_check.status)

        if(verification_check.status === 'approved'){
          
          const verifyUser = await signupModel.updateOne({mobilenum:num},
            {$set:{verified:true}}
            )

          console.log(verifyUser);
          if(verifyUser){
          res.redirect('/otp_success')
          }

        }
        else{ 
            const number = num
            req.flash('otpfailed','Incorrect OTP')
            req.flash('number',number)
            res.redirect(`/otp_verification/${number}`)
        }
    
  } catch (error) {
    console.log(error.message);
  }
   
}
 




module.exports = {sendOtp , verifyOtp}