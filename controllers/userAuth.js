const bcrypt = require('bcrypt')
const moment = require('moment')

const signupModel = require('../models/signup')

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,15}$/

const {sendOtp , verifyOtp} = require('../utils/otp')
const {emailOtp , verify} = require('../utils/emailotp')

exports.getSignup = (req,res) => {
    res.render('user/pages/signup',{state:'',cartCount:0,wishCount:0})    /*  Rendering Signup page */
}
exports.postSignup = async (req, res) => {
     try {
          // Cullect required data from body
          const {
               username,
               email,
               mobilenum,
               password
          } = req.body

          // Has the password before saving it to DB
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password , salt)
          const originalDate = moment().format('DD-MM-YYYY')

          // Make sure thre is no user exists with provided email and phonenumber
          const userNumExist = await signupModel.findOne({email})
          const userEmailExist = await signupModel.findOne({mobilenum})

          if(userNumExist || userEmailExist) {

           const verifyUser = userNumExist.verified
               if (verifyUser) {
                    return res.status(403).json({error:'User Already Exist'})
               } else {
                    sendOtp(mobilenum)
                    
                    /* Passing mobile number for params to get OTP verifypage */
                    res.status(200).json({mobilenum})
               }
          } else {
               // Go ahead if not user exists with provided data
               req.session.mobilenum = mobilenum
               const newSchema = new signupModel({
                    username,
                    email,
                    mobilenum,
                    password: hashedPassword,
                    regdate: originalDate,
               })
               
               await newSchema.save()
               sendOtp(mobilenum)    /* Caling twilio Function */
               res.status(200).json({mobilenum})     
          }
     } catch (error) {
          console.log('Error in post signup',error.message); 
          res.status(500).send('Internal server error')
     }
}

exports.getLogin = (req,res) => {
    res.render('user/pages/login',
     {
          state:'',
          cartCount: 0,
          wishCount: 0,
     }) 
} 

exports.postLogin = async(req,res) => {
    
    try {
         const { email , password} = req.body
         const userExist = await signupModel.findOne({email})  /* Finding user with email */
         

         if(email == '' || password == '') {  /* Checking whether fields is empty */
         
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

                if(!userExist.blocked){
                   req.session.userId = userExist._id
                   req.session.email = email   /* Setting email as session */
                   req.session.loggedin = true
                   return res.status(200).json({auth:true})
                }
                else{
                   return res.status(402).json({auth:false,error:'Sorry You have been Blocked By Admin'})
                }  
                   
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
    console.log('Error in post login',error.message);
    res.status(500).send('Internal server error')
}
}

exports.getOtpverification = async(req,res) => { 
    try {      
         const number = req.params.num

         // Setting error messages while otp incorrect

         const otpFailed = req.flash('otpfailed') || ''
         const otpNumber = req.flash('number') || ''
         res.render('user/pages/otp',{state:'',number,otpFailed,otpNumber,cartCount:0,wishCount:0}) 
    } catch (error) {
         console.log('Error in get otp verification',error.message);
         res.status(500).send('Internal server error')
    }
}

exports.postOtpverification = (req,res) => {
    const number = req.params.num 
    const {D1,D2,D3,D4} = req.body  
    const code = D1+D2+D3+D4  /* Making a 4 digit set */
    verifyOtp(number,code,res,req) 
}   

exports.getResendotp = async (req,res) => {
 try {
    const mobilenum = req.params.num
    sendOtp(mobilenum)
         
    } catch (error) {
         console.log('Error in get resend otp',error.message);
         res.status(500).send('Internal server error')
    }
}

exports.getOtpsuccess = (req,res) => {
    res.render('user/pages/otp_succes',{state:'',success:true,cartCount:0,wishCount:0})
}

exports.getForgetpass = (req, res) => {
    const errMsg = req.flash('errMsg') 
    res.render('user/pages/forgetpass',{state:'',errMsg,cartCount:0,wishCount:0})
}

exports.postForgetpass = async (req, res) => {
    
    try {
         if(req.body.email===''){
           req.flash('errMsg',"Please Enter the Email")
           return res.redirect('/forget_password')
         }
         else if(!emailRegex.test(req.body.email)){   //Testing the email matches a valid email format
          req.flash('errMsg',"Invalid Email Format")
           return res.redirect('/forget_password')
         }
         
         const userExist = await signupModel.findOne({email:req.body.email})

         if(!userExist){
              console.log('hi');
              req.flash('errMsg',"Accound with email not Exist")
              return res.redirect('/forget_password')
         }else{

           emailOtp(req.body.email)
           return res.redirect('/email_otp') 
   
         }
         
    } catch (error) {
         console.log('Error in post forget password',error.message);
         res.status(500).send('Internal server error')
    }
}

exports.getEmailOtp = async(req, res) => {
    try {
         const errMsg =  req.flash('incorrect')
         res.render('user/pages/emailotp',{state:'',errMsg,cartCount:0,wishCount:0})

    } catch (error) {
         console.log('Error admin getemail',error.message)
         res.status(500).send('Internal server error')
    }
}

exports.postEmailOtp = (req, res) => {
    const {D1,D2,D3,D4} = req.body  
    const code = D1+D2+D3+D4        
    verify(code,res,req)
}    

exports.getResendemailotp = async(req,res) =>{

    try {
         const findUser = await signupModel.findOne({mobilenum:req.session.mobilenum}) 
         emailOtp(findUser.email) // calling the email otp function and passing number to function as argument
         req.flash('incorrect','Incorrect OTP')
         res.redirect('/email_otp')

    } catch (error) {
         console.log('Error in get email resend otp',error.message);
         res.status(500).send('Internal server error')
    }
}

exports.getChangepass = (req, res) => {
    const errMsg =  req.flash('errMsg')
    res.render('user/pages/changepassword',{state:'',errMsg,cartCount:0,wishCount:0})
}

exports.postChangepass = async(req, res) => {
    try {

    const {password , confirmpassword } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt) // hashing new password


    if(!password || !confirmpassword){  //checking whether password   and confirmpassword exist
         req.flash('errMsg','Please Fill the Fields')
         return res.status(405).redirect('/change_password')
    }
    else if(!passwordRegex.test(password)){ //checking password regex which should have 1 number and one capital letter
         req.flash('errMsg','Password need one Uppercase and one Number')
         return res.status(405).redirect('/change_password')
    }
    else if(password != confirmpassword){ //checking whether old password and new password matches correct
         req.flash('errMsg','Password Mismatch')
         return res.status(405).redirect('/change_password')
    }else{

         const updatePass = await signupModel.updateOne({mobilenum:req.session.mobilenum},
         {$set:{password:hashedPassword}})

         if(updatePass){
              console.log('Password changed success');
              res.status(200).redirect('/login')
         }else{
              res.status(500)
         }

    } 
    } catch (error) {
         console.log('Error in getchange pass',error.message);
         res.status(500).send('Internal server error')
    }
    
}

