const bcrypt = require('bcrypt')

const productModel = require('../models/products')
const signupModel = require('../models/signup')
const messageModel = require('../models/message')
const wishlistModel = require('../models/wishlist')
const cartModel = require('../models/cart')
const profileModel = require('../models/profile')
const orderModel = require('../models/order')

const {userIssue} = require('../utils/userIssue')
const { Types } = require('mongoose')
const fs = require('fs')

exports.getUpdatepassword = async(req,res) => {

    const userId = req.session.userId

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'updatepassword'
    res.render('user/pages/updatepassword',
    {
      state,
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0
    })
}

exports.postUpdatepassword = async(req,res) => {
    try {    

        //Destructuring old and new password
        const {oldpassword , newpassword} = req.body

        const email = req.session.email
        const user = await signupModel.findOne({email})

        // Checking old password and new one
        const oldpassCheck = await bcrypt.compare(oldpassword,user.password)

        if(!oldpassCheck){
            return res.status(402).json({err:'Incorrect Old Password'})  // 
        } else if (oldpassword === newpassword){

            // Passing error for new password and old password cannot same
            return res.status(402).json({err:'Old password and new Password cannot be Same'}) 
        } else {
             // hashing new password
            const salt = await bcrypt.genSalt(10)
            const newPashedPass = await bcrypt.hash(newpassword , salt)

            await signupModel.updateOne({email},{$set:{password:newPashedPass}}) 

            res.status(200).json({success:true})
        }
        
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in post update password',error.message);
    }
}

exports.getContactus = async(req,res) => {
    
    const userId = req.session.userId

    // Passing wishlist and cart counts
    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'contactus'
    res.render('user/pages/contactus',
    {
      state,
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0
    })
}

exports.postContactus = async(req,res) => {

    try {

       //Storing user message to store message to show for admins
       await messageModel.create(req.body)
       userIssue(req.body)
       res.status(200).json({success:true})

        
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in post contact us',error.message);
    }

}

exports.getAdress = async(req,res) => {
      
    const state = 'address'
    const userId = req.session.userId
    const objUserId = new Types.ObjectId(userId)

    // Passing wishlist and cart counts

    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    if(req.session.loggedin){ // Checking whether any user logged in

     // Finding users profile to pass to page
    const findUser = await signupModel.findOne({_id:userId})
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
     //checking user profile exist
    const userProfile = userAddress.length > 0 ? userAddress[0].userProfile[0] : null

    return res.render('user/pages/address',
    {
      state,
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0,
      userProfile,
      findUser
    })
}
else{
    res.render('user/pages/address',
    {
       state,
       cartCount: cartExist? cartExist.products.length : 0,
       wishCount: wishExist? wishExist.products.length : 0,
       findUser:null,
       userProfile:null
    })
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

        // creating full path for the image
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
            newadress:[
              {
                firstname,
                lastname,
                mobilenum:user.mobilenum,
                country,
                state,
                district,
                address,
                zip,
              }
            ],
            userId,
        })
         
        await newSchema.save() // Saving schema
        res.status(200).json({success:true})

    } catch (error) {
        res.status(500).send('Internal Server Error')
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


    res.render('user/pages/editaddress',
    {
      state:'',
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0 ,
      userProfile,
      findUser,
      profileId,
    })
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
         //checking whether new image added if not select old
        const  imagePath = req.file? '/profile-image/' + req.file.filename : userProfile.photo 
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
        res.status(200).json({success:true})
    }
        
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in post edit address',error);
    }
}

exports.postRatingReview = async(req,res) =>{
    try {
        const userId = new Types.ObjectId(req.session.userId)
        const productId = new Types.ObjectId(req.query.productId)

        const { rating , review } = req.body

        const ratingObj = {
            userId, 
            productId,
            rating,
            review,
        } 

        await productModel.updateOne(
            {_id:productId},
            {$push:{review:ratingObj}}
        )

        res.status(200).json({success:true})
        
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in post rating and review',error);
    }
}

exports.getAboutus = async(req,res) => {
    
    const userId = req.session.userId

    // Passing wishlist and cart counts
    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    // Rendering about us page
    const state = 'aboutus'
    res.render('user/pages/aboutus',
    {
      state,
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0
    })
}

exports.getOrder = async(req,res) => {

    try {
        
    const userId = req.session.userId
    const findOrder = await orderModel.findOne({userId}).populate('products.productId')
    const userOrders = findOrder? findOrder.products : [] 

    // Passing wishlist and cart counts
    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'orders'
    res.render('user/pages/orders',
    {
      state,
      cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0,
      userOrders
    })

    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in get order page',error);    
    }
}       

exports.getOrderOpen = async(req,res) => {

    const userId = req.session.userId
    const orderId = req.query.orderId 

    if(!req.session.loggedin){
        return res.redirect('/login')
    }     
    const profileExist = await profileModel.findOne({userId})

    const findOrder = await orderModel.findOne({ userId }).populate('products.productId')

    const userOrder = findOrder.products.find((order)=> order._id == orderId)

    const reviewExist = await productModel.findOne(
        {
            'review.productId': userOrder.productId._id,
            'review.userId': userId
        }
    );

    const userRating = reviewExist? reviewExist.review.find((rating)=>rating.userId = userId) : ''


    const shippAddress =  profileExist.newadress.find((address) => address._id == userOrder.shipping_adress )

    // Passing wishlist and cart counts
    const wishExist = await wishlistModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})

    const state = 'orders'
    res.render('user/pages/orderopen',
    {
     state,
     cartCount: cartExist? cartExist.products.length : 0,
     wishCount: wishExist? wishExist.products.length : 0,
     userOrder,
     shippAddress,
     reviewExist,
     userRating
    })
}

exports.putCancelorder = async(req,res) => {
    try {

        const userId = req.session.userId
        const productId = req.body.productId

        const updateStatus = await orderModel.updateOne(
            {userId ,'products._id':productId},
            { $set: { "products.$.status": 'cancelled' } }
        )
        const findOrder = await orderModel.findOne({userId});
        const findProduct = findOrder.products.find((product)=> product._id == productId)
        
        await productModel.updateOne(
            {_id:productId},
            {$inc:{stock:+findProduct.quantity}}
            )

        if(updateStatus){
            res.status(200).json({success:true})
        }  
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.log('Error in admin get orders',error);
    }
}