const bcrypt = require('bcrypt')
const moment = require('moment')

const adminDatas = require('../models/admin_signup')

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/






// <<<< ========== SIGNUP ========== >>>>>




exports.getSignup = (req, res) => {
    res.render('admin/pages/signup')
}



exports.postSignup = async(req, res) => {
    try {

        const { username , email , mobilenum , password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)    /* Hashing with Salting */

        const originalDate = moment().format('DD-MM-YYYY')
    
        const userNumExist = await adminDatas.findOne({email})
        const userEmailExist = await adminDatas.findOne({mobilenum})


        if(userNumExist || userEmailExist){    /* Checking whether user exist or not */

        const verifyUser = userNumExist.verified
   
        if(verifyUser){       /* checking whether user verified or not */
   
         console.log('user exist');
         return res.status(403).json({error:'User Already Exist'})
   
        }
        else{
          return res.status(200).json({email}) /* Passing email for params to get OTP verifypage */
        }
       }
       else{
        const newSchema = new adminDatas({
           username,
           email,
           mobilenum,
           password:hashedPassword,
           regdate:originalDate
        })
    
        await newSchema.save()
        res.status(200).json({email})
        console.log('Data stored in database')
        }
    
    } catch (error) {
         console.log('error in admin signup',error.message); 
         res.status(500)
    }
}









// <<<< ========== KEY VERIFICATION ========== >>>>>





exports.getKeyverify = (req, res) => {

    const email = req.params.email
    const errMsg = req.flash('wrongkey')
    res.render('admin/pages/key_verify',{email,errMsg})
}


exports.postKeyverify = async(req,res) => {

    try {
        const secretKey = process.env.KEY_VERIFY
        const {password} = req.body
        const email = req.params.email

        if(!password){
            req.flash('wrongkey',"Please Enter the KEY")
            return res.redirect(`/admin/key_verification/${email}`)

        }else{


        if(secretKey==password){
          const verifyAdmin = await adminDatas.updateOne({email},
          {$set:{verified:true}}
          )

          if(verifyAdmin){
            console.log('Admin verified success');
            res.redirect('/admin/login')
          }
        }
        else{
            req.flash('wrongkey',"Incorrect Verification KEY")
            return res.redirect(`/admin/key_verification/${email}`)
        }
      }
        
    } catch (error) {
        console.log('Error in admin keyvrification',error.message);
    }
}




// <<<< ========== LOGIN ========== >>>>>





exports.getLogin = (req, res) => {
    res.render('admin/pages/login')
}



exports.postLogin = async(req,res) => {
     
    try {
         const { email , password} = req.body
         const userExist = await adminDatas.findOne({email})  /* Finding user with email */


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

                req.session.admin = true
                return res.status(200).json({auth:true})

              }
              else{
                return res.status(200).json({auth:false,email})    
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



// <<<<< ============== EMAIL VERIFY =============== >>>>



exports.getEmailverify = (req,res) => {
    const errMsg = req.flash('errMsg') 
    res.render('admin/pages/emailverify',{errMsg})
}


exports.postEmailverify = async(req,res) => {
   
    try {
        if(req.body.email===''){
          req.flash('errMsg',"Please Enter the Email")
          return res.redirect('/admin/email_verify')
        }
        else if(!emailRegex.test(req.body.email)){
         req.flash('errMsg',"Invalid Email Format")
          return res.redirect('/admin/email_verify')
        }
        
        const userExist = await adminDatas.findOne({email:req.body.email})

        if(!userExist){
             req.flash('errMsg',"Accound with email not Exist")
             return res.redirect('/admin/email_verify')
            }else{
          return res.redirect('/admin/forget_password') 
        }
        
   } catch (error) {
        console.log('Error in post forget password',error.message);
   }
}






// <<<<< ============ FORGET PASSWORD ============= >>>>>




exports.getForgetpassword = (req, res) => {
    const errMsg = req.flash('wrongkey')
    res.render('admin/pages/forgetpass',{errMsg})
}



exports.postForgetpassword = async(req,res) => {
    try {
        const secretKey = process.env.KEY_VERIFY
        const {password} = req.body

        if(!password){
            req.flash('wrongkey',"Please Enter the Verification KEY")
            return res.redirect(`/admin/forget_password`)

        }



        if(secretKey==password){

            req.session.admin = true
            res.redirect('/admin/home')

       }else{
        req.flash('wrongkey',"Incorrect Verification KEY")
        return res.redirect(`/admin/forget_password`)
     }     
} catch (error) {
    console.log('Error in admin keyvrification',error.message);
}
}





// <<<<< ============== HOME ================= >>>>>





exports.getHome = (req, res) => {
    const state = 'dashboard'
    res.render('admin/pages/dashboard', { state })
}


exports.getUsers = (req, res) => {
    const state = 'users'
    res.render('admin/pages/users', { state })
}


exports.getProducts = (req, res) => {
    const state = 'products'
    res.render('admin/pages/products', { state })
}


exports.getCategory = (req, res) => {
    const state = 'category'
    res.render('admin/pages/category', { state })
}

exports.getCoupons = (req, res) => {
    const state = 'coupons'
    res.render('admin/pages/coupons', { state })
}

exports.getOrders = (req,res) => {
    const state = 'orders'
    res.render('admin/pages/orders', { state })
}

exports.getMessages = (req, res) => {
    const state = 'messages'
    res.render('admin/pages/messages', { state })
}

exports.getBanners = (req, res) => {
    const state = 'banners'
    res.render('admin/pages/banners', { state })
}


exports.getAddproducts = (req,res) =>{
    res.render('admin/pages/addproducts',{state:''})
}

exports.getAddcatogery = (req,res) =>{
    res.render('admin/pages/addcategory',{state:''})
}


exports.getAddbanner = (req,res) =>{
    res.render('admin/pages/addbanner',{state:''})
}


exports.getAddcoupons = (req,res) =>{
    res.render('admin/pages/addcoupons',{state:''})
}


exports.getUsermessage = (req,res) =>{
    res.render('admin/pages/usermessage',{state:''})
}


exports.getCustomer = (req,res) =>{
    res.render('admin/pages/individualuser',{state:''})
}

