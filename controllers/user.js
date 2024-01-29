const bcrypt = require('bcrypt')
const signupModel = require('../models/signup')


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
     res.status(200).json({mobilenum})
     console.log('Success');
}
} catch (error) {
     console.log(error.message); 
     res.status(500)
}
}






exports.getLogin = (req,res) => {
     res.render('user/pages/login',{state:''})
}
exports.getOtpverification = async(req,res) => {

     res.render('user/pages/otp',{state:''})

     const number = req.params.num
     try {

          
          
     } catch (error) {
          console.log(error)
     }
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

