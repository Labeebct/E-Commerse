const bcrypt = require('bcrypt')
const moment = require('moment')

const signupModel = require('../models/signup')
const productModel = require('../models/products')
const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')
const messageModel = require('../models/message')


const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,15}$/


const {sendOtp , verifyOtp} = require('../middleware/otp')
const {emailOtp , verify} = require('../middleware/emailotp')
const category = require('../models/category')







// <<<< ===================================== SIGNUP ======================================== >>>>>






exports.getSignup = (req,res) => {
     res.render('user/pages/signup',{state:''})    /*  Rendering Signup page */
}


exports.postSignup = async(req,res) => {
try {

    const {username, email , mobilenum , password} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)    /* Hashing with Salting */
    const originalDate = moment().format('DD-MM-YYYY')

    const signupDatas = await signupModel.find()

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
     const newSchema = new signupModel({
          username,
          email,
          mobilenum,
          password:hashedPassword,
          regdate:originalDate
       })
   
     await newSchema.save()
     sendOtp(mobilenum)    /* Caling twilio Function */
     console.log('OTP has send to the' + mobilenum);
     res.status(200).json({mobilenum})
     console.log('Data stored in database')
     
}
} catch (error) {
     console.log('Error in post signup',error.message); 
     res.status(500)
}
}




// <<<< ================================================= LOGIN ============================================= >>>>>







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
               req.session.loggedin = true
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
     console.log('Error in post login',error.message);
}
}




// <<<< ========================================== OTP VERIFICATION =========================================== >>>>>





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




// <<<< ============================================== RESEND OTP ================================================== >>>>>




exports.getResendotp = async (req,res) => {
  try {
     const mobilenum = req.params.num
     sendOtp(mobilenum)
          
     } catch (error) {
          console.log('Error in get resend otp',error.message);
     }
}




exports.getOtpsuccess = (req,res) => {
     res.render('user/pages/otp_succes',{state:'',success:true})
}






// <<<<<============================================== FORGET PASSWORD =========================================== >>>>




exports.getForgetpass = (req, res) => {
     const errMsg = req.flash('errMsg') 
     res.render('user/pages/forgetpass',{state:'',errMsg})
}



exports.postForgetpass = async (req, res) => {
     
     try {
          if(req.body.email===''){
            req.flash('errMsg',"Please Enter the Email")
            return res.redirect('/forget_password')
          }
          else if(!emailRegex.test(req.body.email)){
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
     }
}




// <<<<<========================================== EMAIL OTP ====================================================>>>>



exports.getEmailOtp = async(req, res) => {
     try {
          const errMsg =  req.flash('incorrect')
          res.render('user/pages/emailotp',{state:'',errMsg})

     } catch (error) {
          console.log('Error admin getemail',error.message)
     }
}


exports.postEmailOtp = (req, res) => {
     const {D1,D2,D3,D4} = req.body  
     const code = D1+D2+D3+D4
     verify(code,res,req)
}    




// <<<<<< ========================================= RESEND EMAIL OTP ======================================= >>>>>>



exports.getResendemailotp = async(req,res) =>{

     try {
          const findUser = await signupModel.findOne({mobilenum:req.session.mobilenum})
          emailOtp(findUser.email)
          req.flash('incorrect','Incorrect OTP')
          res.redirect('/email_otp')

     } catch (error) {
          console.log('Error in get email resend otp',error.message);
     }
}




// <<<<<====================================== CHANGE PASSWORD =====================================================>>>>





exports.getChangepass = (req, res) => {
     const errMsg =  req.flash('errMsg')
     res.render('user/pages/changepassword',{state:'',errMsg})
}

  
exports.postChangepass = async(req, res) => {
     try {
          

     const {password , confirmpassword } = req.body

     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt)


     if(!password || !confirmpassword){
          req.flash('errMsg','Please Fill the Fields')
          return res.status(405).redirect('/change_password')
     }
     else if(!passwordRegex.test(password)){
          req.flash('errMsg','Password need one Uppercase and one Number')
          return res.status(405).redirect('/change_password')
     }
     else if(password != confirmpassword){
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
     }
     
}






// <<<<< ============================================== HOME ========================================================= >>>>>






exports.getHome = async(req,res) => {

     try {
        

          const state = 'home'
          const categories = await categoryModel.find()

          const mensShirts = await productModel.aggregate([
               {$match:{subcategory:'MENS SHIRTS'}}
          ])
          const mensTshirts = await productModel.aggregate([
               {$match:{subcategory:'MENS TSHIRT'}}
          ])
          const womensKurtas = await productModel.aggregate([
               {$match:{subcategory:'WOMENS KURTA'}}
          ])
          const womensSaree = await productModel.aggregate([
               {$match:{subcategory:'WOMENS SAREE'}}
          ])
          const mensShoes = await productModel.aggregate([
               {$match:{subcategory:'MENS SHOES'}}
          ])
          const womensFootwear = await productModel.aggregate([
               {$match:{subcategory:'WOMENS FOOTWEAR'}}
          ])
          
          const mensPant = await productModel.aggregate([
               {$match:{subcategory:'MENS PANTS'}}
          ])
          const womensTop = await productModel.aggregate([
               {$match:{subcategory:'WOMENS TOP'}}
          ])
      

          const kidsFrocks = await productModel.aggregate([
               {$match:{subcategory:'KIDS FROCK'}}
          ])
          const kidsToys = await productModel.aggregate([
               {$match:{subcategory:'KID TOYS'}}
          ])
      
          const babyWipes = await productModel.aggregate([
               {$match:{subcategory:'BABY WIPES'}}
          ])
      
          const mobiles = await productModel.aggregate([
               {$match:{subcategory:'MOBILES'}}
          ])
          const laptops = await productModel.aggregate([
               {$match:{subcategory:'LAPTOPS'}}
          ])
          const fridge = await productModel.aggregate([
               {$match:{subcategory:'FRIDGE'}}
          ])
          const headset = await productModel.aggregate([
               {$match:{subcategory:'HEADSET'}}
          ])
          const tv = await productModel.aggregate([
               {$match:{subcategory:'TV'}}
          ])

          const mensWatches = await productModel.aggregate([
               {$match:{subcategory:'MENS WATCHES'}}
          ])
          const painting = await productModel.aggregate([
               {$match:{subcategory:'PAINTINGS'}}
          ])
          const bedsheet = await productModel.aggregate([
               {$match:{subcategory:'BEDSHEET'}}
          ])
          const utensils = await productModel.aggregate([
               {$match:{subcategory:'UTENSILS'}}
          ])



          res.render('user/pages/home',
          {
          state,
          categories,
          mensShirts,
          mensShoes,
          mensWatches,
          womensTop,
          womensKurtas,
          womensFootwear,
          mensPant,
          kidsFrocks,
          kidsToys,
          babyWipes,
          mobiles,
          laptops,
          fridge,
          headset,
          tv,
          mensTshirts,
          womensSaree,
          painting,
          bedsheet,
          utensils
          })


          
     } catch (error) {
          console.log('Error in user home get',error);
     }
}




exports.getCategory = async(req,res) => {
     try {        

          const category = req.params.cat
          const categories = await categoryModel.find()

          const catProducts = await productModel.aggregate([
               { $match: {category:category} }
          ])          

          res.render('user/pages/categoryproducts',{state:category, catProducts , categories})
          
     } catch (error) {
          console.log('Error in get category',error);
     }
}



exports.getSubcategory = async(req,res) => {
     try {        

          const subcat = req.params.subcat
          const categories = await categoryModel.find()

          console.log(subcat);


          const subcatProducts = await productModel.aggregate([
               { $match: {subcategory:subcat} }
          ])          

          res.render('user/pages/subcatproducts',{state:subcat, subcatProducts , categories})
          
     } catch (error) {
          console.log('Error in get category',error);
     }
}





exports.getProductopen = async(req,res) => {
     try {
          const productId = req.query.product

          const product = await productModel.findById(productId)

          res.render('user/pages/productopen',{state:'',product})
          
     } catch (error) {
          console.log('Error in get product open',error);
     }
}




exports.getCart = (req,res) => {
     const state = 'cart'
     res.render('user/pages/cart',{state})
}




exports.getWishlist = (req,res) => {
     const state = 'wishlist'
     res.render('user/pages/wishlist',{state})
}

