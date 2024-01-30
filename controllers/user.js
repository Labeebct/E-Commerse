const bcrypt = require('bcrypt')
const signupModel = require('../models/signup')

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/

const {sendOtp , verifyOtp} = require('../middleware/otp')
const emailOtp = require('../middleware/emailotp')







// <<<< ========== SIGNUP ========== >>>>>






exports.getSignup = (req,res) => {
     res.render('user/pages/signup',{state:''})    /*  Rendering Signup page */
}


exports.postSignup = async(req,res) => {
try {

    const { email , mobilenum , password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)    /* Hashing with Salting */

    req.body.password = hashedPassword      /* Replacing req body password with hashed password */

    const userNumExist = await signupModel.findOne({email})
    const userEmailExist = await signupModel.findOne({mobilenum})

    if(userNumExist || userEmailExist){    /* Checking whether user exist or not */

     const verifyUser = userNumExist.verified

     if(verifyUser){       /* checking whether user verified or not */

      console.log('user exist');
      return res.status(403).json({error:'User Already Exist'})

     }
     else{
     sendOtp(mobilenum)
     console.log('OTP has send to the' + mobilenum);
     res.status(200).json({mobilenum}) /* Passing mobile number for params to get OTP verifypage */
     }
    }
    else{
     req.session.mobilenum = mobilenum
     await signupModel.create(req.body)
     sendOtp(mobilenum)    /* Caling twilio Function */
     console.log('OTP has send to the' + mobilenum);
     res.status(200).json({mobilenum})
     console.log('Data stored in database')
     
}
} catch (error) {
     console.log(error.message); 
     res.status(500)
}
}




// <<<< ========== LOGIN ========== >>>>>







exports.getLogin = (req,res) => {
     res.render('user/pages/login',{state:''}) 
} 



exports.postLogin = async(req,res) => {
     
     try {
          const { email , password} = req.body
          const userExist = await signupModel.findOne({email})  /* Finding user with email */
          

          if(email == '' || password == ''){  /* Checking whether fields is empty */
          
          return res.status(402).json({error:'Please all Fields'})
     }
     else if(!emailRegex.test(email)){  /* Checking email format  */

               return res.status(402).json({error:'Invalid Email Format'})
          }
          
          if(!userExist){
               return res.status(402).json({error:'User not Exist'})         
          }else{
               
               const hashedPassword = userExist.password
               const comparePass = await bcrypt.compare(password,hashedPassword)  /* Comparing passwords */

               if(comparePass){

               if(userExist.verified){
                    
               req.session.email = email   /* Setting email as session */
               return res.status(200).json({auth:true})
                    
               }
               else{
               console.log('unverified');
               const mobilenum = userExist.mobilenum
               sendOtp(mobilenum)
               return res.status(200).json({auth:false,mobilenum})
          }
     }
     else{
          return res.status(402).json({error:'Incorrect Password'})     
          }
          
     }
     
} catch (error) {
     console.log(error.message);
}
}




// <<<< ========== OTP VERIFICATION ========== >>>>>





exports.getOtpverification = async(req,res) => { 
     try {      
          const number = req.params.num
     
          // Setting error messages while otp incorrect
     
          const otpFailed = req.flash('otpfailed') || ''
          const otpNumber = req.flash('number') || ''
          res.render('user/pages/otp',{state:'',number,otpFailed,otpNumber}) 
     } catch (error) {
          console.log(error.message);
     }
}


exports.postOtpverification = (req,res) => {
     const number = req.params.num 
     const {D1,D2,D3,D4} = req.body  
     const code = D1+D2+D3+D4  /* Making a 4 digit set */
     verifyOtp(number,code,res,req) 
}   




// <<<< ========== RESEND OTP ========== >>>>>




exports.getResendotp = async (req,res) => {
  try {
     const mobilenum = req.params.num
     sendOtp(mobilenum) /* Appliying OTP sending Function */
          
     } catch (error) {
          console.log(error.message);
     }
}




exports.getOtpsuccess = (req,res) => {
     res.render('user/pages/otp_succes',{state:'',success:true})
}






// <<<<<============== FORGET PASSWORD ============>>>>




exports.getForgetpass = (req, res) => {
     const errMsg = req.flash('errMsg') 
     res.render('user/pages/forgetpass',{state:'',errMsg})
}



exports.postForgetpass = async (req, res) => {
     
     try {
          const email = 'rameest41750@gmail.com'
   
          if(req.body.email===''){
            req.flash('errMsg',"Please Enter the Email")
            return res.redirect('/forget_password')
          }
          else if(!emailRegex.test(req.body.email)){
           req.flash('errMsg',"Invalid Email Format")
            return res.redirect('/forget_password')
          }
          
          const userExist = await signupModel.findOne({email:req.body.email})
          console.log(userExist);

          if(!userExist){
               console.log('hi');
               req.flash('errMsg',"Accound with email not Exist")
               return res.redirect('/forget_password')
          }else{
            console.log(email);
            emailOtp(email)
            return res.redirect('/email_otp') 
          }
          
     } catch (error) {
          console.log('Error in post forget password',error.message);
     }
}




// <<<<<============== EMAIL OTP ============>>>>



exports.getEmailOtp = (req, res) => {
     res.render('user/pages/emailotp',{state:''})
}


exports.postEmailOtp = (req, res) => {

}




// <<<<<============== CHANGE PASSWORD ============>>>>



exports.getChangepass = (req, res) => {
     res.render('user/pages/changepassword',{state:''})
}


exports.postChangepass = (req, res) => {
     
}






// <<<<< ============ HOME ============== >>>>>






exports.getHome = (req,res) => {
     const state = 'home'
     res.render('user/pages/home',{state})
}
 

exports.getCart = (req,res) => {
     const state = 'cart'
     res.render('user/pages/cart',{state})
}


exports.getProductopen = (req,res) => {
     res.render('user/pages/productopen',{state:''})
}

exports.getWishlist = (req,res) => {
     const state = 'wishlist'
     res.render('user/pages/wishlist',{state})
}

