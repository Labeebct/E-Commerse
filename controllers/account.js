const bcrypt = require('bcrypt')

const signupModel = require('../models/signup')
const messageModel = require('../models/message')
const wishlistModel = require('../models/wishlist')
const cartModel = require('../models/cart')
const profileModel = require('../models/profile')
const { Types } = require('mongoose')




// <<<< ================================ UPDATE PASSWORD ================================ >>>>




exports.getUpdatepassword = async(req,res) => {

    const userId = req.session.userId

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'updatepassword'
    res.render('user/pages/updatepassword',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}




exports.postUpdatepassword = async(req,res) => {
    try {          

        const {oldpassword , newpassword} = req.body

        const email = req.session.email
        const user = await signupModel.findOne({email})
       
        const oldpassCheck = await bcrypt.compare(oldpassword,user.password)

        if(!oldpassCheck){
            return res.status(402).json({err:'Incorrect Old Password'})
        }
        else if(oldpassword === newpassword){
            return res.status(402).json({err:'Old password and new Password cannot be Same'})
        }
        else{
            const salt = await bcrypt.genSalt(10)
            const newPashedPass = await bcrypt.hash(newpassword , salt)

            await signupModel.updateOne({email},{$set:{password:newPashedPass}})

            console.log('Successfully updated password');

            res.status(200).json({success:true})
        }
        
    } catch (error) {
        console.log('Error in post update password',error.message);
    }
}





// <<<< ======================================= CONTACT US ================================== >>>>






exports.getContactus = async(req,res) => {
    
    const userId = req.session.userId

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'contactus'
    res.render('user/pages/contactus',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}
  



exports.postContactus = async(req,res) => {

    try {

       await messageModel.create(req.body)
       res.status(200).json({success:true})

        
    } catch (error) {
        console.log('Error in post contact us',error.message);
    }

}







// <<<< ==================================== PROFILE ================================== >>>>







exports.getAdress = async(req,res) => {

    const state = 'address'
    const userId = req.session.userId
    const objUserId = new Types.ObjectId(userId)

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const userAddress = await signupModel.aggregate([
        {
          $match:{
            _id:objUserId
          }
        },{
            $lookup:{
            from:'profiles',
            localField:'_id',
            foreignField:'userId',
            as:'userProfile'
        }}    
    ])

    const userSignupData = userAddress[0]
    const userProfile = userAddress[0].userProfile[0] 

    res.render('user/pages/address',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0,userProfile,userSignupData})
}  







exports.postAddress = async(req,res) => {
   
    try {

        if(!req.file){
            return res.status(402).json({err:'Please Provide a Profile'})
        }

        const { firstname,lastname,DOB,country,state,district,address,landmark,zip } = req.body

        const user = await signupModel.findOne({email:req.session.email})

        const userId = new Types.ObjectId(user._id)

        const imagePath = '/profile-image/' + req.file.filename
        
        const newSchema = new profileModel({
            firstname,
            lastname,
            photo:imagePath,
            DOB,
            country,
            state,
            district,
            address,
            landmark,
            zip,
            newadress:[],
            userId,
        })
         
        await newSchema.save()

        console.log('Successfully profile updated');

        res.status(200).json({success:true})

        
    } catch (error) {
        console.log('Error in post address',error.message);
    }
}






exports.getEditaddress = async(req,res) => {

    const userId = req.session.userId

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    res.render('user/pages/editaddress',{state:'',cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}








// <<<< ======================================= ABOUT US ================================== >>>>








exports.getAboutus = async(req,res) => {
    
    const userId = req.session.userId

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'aboutus'
    res.render('user/pages/aboutus',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}




exports.getOrder = async(req,res) => {

    const userId = req.session.userId

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'orders'
    res.render('user/pages/orders',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}

