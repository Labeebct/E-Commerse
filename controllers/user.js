const bcrypt = require('bcrypt')
const signupModel = require('../models/signup')

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,15}$/

const {sendOtp , verifyOtp} = require('../middleware/otp')







// --------------- SIGNUP ---------------






exports.getSignup = (req,res) => {
     res.render('user/pages/signup',{state:''})
}


exports.postSignup = async(req,res) => {
try {

    const {username , email , mobilenum , password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)
    req.body.password = hashedPassword

    const userNumExist = await signupModel.findOne({email})
    const userEmailExist = await signupModel.findOne({mobilenum})

    if(userNumExist || userEmailExist){
      console.log('user exist');
      res.status(403).json({error:'User Already Exist'})
    }
    else{
     await signupModel.create(req.body)
     sendOtp(mobilenum)
     console.log('OTP has send to the' + mobilenum);
     res.status(200).json({mobilenum})
     console.log('Data stored in database')
     
}
} catch (error) {
     console.log(error.message); 
     res.status(500)
}
}






// --------------- LOGIN ---------------






exports.getLogin = (req,res) => {
     res.render('user/pages/login',{state:''})
} 



exports.postLogin = async(req,res) => {
     
     try {
          const { email , password} = req.body
          const userExist = await signupModel.findOne({email})


          if(email == '' || password == ''){
               return res.status(402).json({error:'Please all Fields'})
          }
          else if(!emailRegex.test(email)){
               return res.status(402).json({error:'Invalid Email Format'})
          }

          if(!userExist){
               return res.status(402).json({error:'User not Exist'})         
          }else{

          const hashedPassword = userExist.password
          const comparePass = await bcrypt.compare(password,hashedPassword)

          if(comparePass){
               req.session.email = email
               return res.status(200).json({auth:true})
          }
          else{
               return res.status(402).json({error:'Incorrect Password'})         
          }

          }
      
     } catch (error) {
          console.log(error.message);
     }
}




exports.getOtpverification = async(req,res) => { 
     const number = req.params.num
     const otpFailed = req.flash('otpfailed') || ''
     const otpNumber = req.flash('number') || ''
     res.render('user/pages/otp',{state:'',number,otpFailed,otpNumber})
}


exports.postOtpverification = (req,res) => {
     const number = req.params.num
     const {D1,D2,D3,D4} = req.body
     const code = D1+D2+D3+D4
     verifyOtp(number,code,res,req)
}   



exports.getResendotp = async (req,res) => {
  try {
  
     const mobilenum = req.params.num
     sendOtp(mobilenum)
          
     } catch (error) {
          console.log(error.message);
     }
}




exports.getOtpsuccess = (req,res) => {
     res.render('user/pages/otp_succes',{state:'',success:true})
}

 

exports.getCart = (req,res) => {
     const state = 'cart'
     res.render('user/pages/cart',{state})
}

exports.getHome = (req,res) => {
     const state = 'home'
     res.render('user/pages/home',{state})
}

exports.getProductopen = (req,res) => {
     res.render('user/pages/productopen',{state:''})
}

exports.getWishlist = (req,res) => {
     const state = 'wishlist'
     res.render('user/pages/wishlist',{state})
}

