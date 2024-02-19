const bcrypt = require('bcrypt')

const signupModel = require('../models/signup')
const messageModel = require('../models/message')
const wishlistModel = require('../models/wishlist')
const cartModel = require('../models/cart')
const profileModel = require('../models/profile')
const { Types } = require('mongoose')
const fs = require('fs')




// <<<< ================================ UPDATE PASSWORD ================================ >>>>




exports.getUpdatepassword = async(req,res) => {

    const userId = req.session.userId

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'updatepassword'
    res.render('user/pages/updatepassword',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}




exports.postUpdatepassword = async(req,res) => {
    try {          

        const {oldpassword , newpassword} = req.body  //Destructuring old and new password

        const email = req.session.email
        const user = await signupModel.findOne({email})
       
        const oldpassCheck = await bcrypt.compare(oldpassword,user.password) // Checking old password and new one

        if(!oldpassCheck){
            return res.status(402).json({err:'Incorrect Old Password'})  // 
        }
        else if(oldpassword === newpassword){
            return res.status(402).json({err:'Old password and new Password cannot be Same'}) // Passing error for new password and old password cannot same
        }
        else{
            const salt = await bcrypt.genSalt(10)
            const newPashedPass = await bcrypt.hash(newpassword , salt) // hashing new password

            await signupModel.updateOne({email},{$set:{password:newPashedPass}}) //Updating new password

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

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'contactus'
    res.render('user/pages/contactus',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}
  





exports.postContactus = async(req,res) => {

    try {

       //Storing user message to store message to show for admins

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

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    if(req.session.loggedin){ // Checking whether any user logged in

    const findUser = await signupModel.findOne({_id:userId})
    const userAddress = await signupModel.aggregate([  // Finding users profile to pass to page
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
    
    const userProfile = userAddress.length > 0 ? userAddress[0].userProfile[0] : null //checking user profile exist

    console.log(userProfile);

    return res.render('user/pages/address',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0,userProfile,findUser})
}
else{
    res.render('user/pages/address',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0,findUser:null,userProfile:null})
}
     
}    







exports.postAddress = async(req,res) => {
   
    try {

        if(!req.file){
            return res.status(402).json({err:'Please Provide a Profile'})
        }

        const { firstname,lastname,DOB,country,state,district,address,landmark,zip } = req.body

        const user = await signupModel.findOne({email:req.session.email})

        const userId = new Types.ObjectId(user._id)

        const imagePath = '/profile-image/' + req.file.filename  // creating full path for the image

        
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
            newadress:[
                {
                    firstname,
                    lastname,
                    mobilenum:user.mobilenum,
                    country,
                    state,
                    district,
                    address,
                    landmark,
                    zip,
                }
            ],
            userId,
        })
         
        await newSchema.save() // Saving schema

    

        console.log('Successfully profile updated');

        res.status(200).json({success:true})

                 
    } catch (error) {
        console.log('Error in post address',error.message);
    }
}         


              



exports.getEditaddress = async(req,res) => {

    const userId = req.session.userId
    const profileId = req.query.id


    // Passing wishlist and cart counts

    const userProfile = await profileModel.findById(profileId)
    const findUser = await signupModel.findOne({_id:userId})


    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})


    res.render('user/pages/editaddress',{state:'',cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0 ,userProfile,findUser,profileId})
}


exports.posEditAddress = async(req,res) => {

    try {


        const userId = req.session.userId
        const profileId = req.query.id // getting the profile id to edit 
        
        const {   
            username,
            firstname,
            mobilenum,
            lastname,
            email,
            DOB,
            country,
            state,
            district,
            address,
            landmark,
            zip,
        } = req.body
        
        const userProfile = await profileModel.findById(profileId)
        const  imagePath = req.file? '/profile-image/' + req.file.filename : userProfile.photo  //checking whether new image added if not select old
        req.file? fs.unlinkSync('public/' + userProfile.photo ) : '' // Deleting old images from folder
   

       const updateProfile =  await profileModel.updateOne(
            {_id:profileId},
            {
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
            }
        )   

       const updateUserdata =  await signupModel.updateOne(  // Option to update user sigup data in user profile
            {_id:userId},
            {
                username,
                email,
                mobilenum
            })
        
    if(updateProfile || updateUserdata ){
        console.log('Successfully profile updated');
        res.status(200).json({success:true})
    }
        
    } catch (error) {
        console.log('Error in post edit address',error);
    }




}








// <<<< ======================================= ABOUT US ================================== >>>>








exports.getAboutus = async(req,res) => {
    
    const userId = req.session.userId


    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    // Rendering about us page

    const state = 'aboutus'
    res.render('user/pages/aboutus',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}




exports.getOrder = async(req,res) => {

    const userId = req.session.userId

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'orders'
    res.render('user/pages/orders',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}


exports.getOrderOpen = async(req,res) => {

    const userId = req.session.userId

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'orders'
    res.render('user/pages/orderopen',{state,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
}

