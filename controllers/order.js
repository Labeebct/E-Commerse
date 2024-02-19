const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const profileModel = require('../models/profile')
const signupModel = require('../models/signup')
const couponModel = require('../models/coupon')
const { ObjectId } = require('mongodb');

const { Types } = require('mongoose')
const profile = require('../models/profile')



exports.getCheckout = async(req,res) => {

    try {
        
        const state = ''
        const userId = req.session.userId

        let productArray=[];
        
        const productId = req.query.product
        const cartId = req.query.cart

        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
        
        const cartTotal = req.query.totalamount
        // Checking whether profile exist or not
        
        const profileExist = await profileModel.findOne({userId})
        const signupData = await signupModel.findById(userId)
        const coupons = await couponModel.find()

        const cartQuantity = cartExist ? cartExist.products : []

        const userAddress = profileExist.newadress
                 
        if(!req.session.loggedin){
            return res.redirect('/login')
        }

        if(!profileExist){
            return res.redirect('/account/address')
        }
        // checking cart or whixhlist exist for showing cart and wishlist count

        if(productId){
          const findProduct = await productModel.findById(productId)
          productArray.push(findProduct)
        }
        else{   
                   
          const findCart = await cartModel.findById(cartId)

          const productIds = findCart.products.map((product)=> product.productId) //looping cart database to get product id from cart products array
          productArray = await productModel.find({_id:{$in:productIds}})  // finding product from product database that matching cart product product id
        }
               
        res.render('user/pages/checkout'
        ,{
          state,ObjectId,cartCount: cartExist? cartExist.products.length : 0,
          wishCount: wishExist? wishExist.products.length : 0,
          productArray,
          cartTotal,
          profileExist,
          signupData,
          cartQuantity,
          userAddress, 
          coupons
        })
    
    } catch (error) {
        console.log('Error in order Summury get',error);
    }

}




exports.getOrderSummary = async(req,res) => {

    try {
        
        const state = ''
        const userId = req.session.userId

        // checking cart or whixhlist exist for showing cart and wishlist count
    
        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})


       
         res.render('user/pages/ordersummary',{state,ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
    
    } catch (error) {
        console.log('Error in order Summury get',error);
    }

}



exports.deleteCheckout = () =>{
    try {



        
    } catch (error) {
        console.log('Error in delete from checkout',error.message);
    }
}

exports.postAddnewadress = async(req,res) =>{
    try {

     const userId = req.session.userId

     const newAddress = req.body
    
     const profileExist = await profileModel.findOne({userId})
     const signupData = await signupModel.findById(userId)

    await profileModel.updateOne({userId},
        {$push:{newadress:newAddress}}
        )

    const arrayLength = profileExist.newadress.length-1

    const latestAddress = profileExist.newadress[arrayLength]


     res.status(200).json({success:true,newAddress,latestAddress,arrayLength})
        
    } catch (error) {
        console.log('Error in add new address from checkout',error.message);
    }
}

  
exports.selectAddress = async (req,res) =>{
    try {

    const userId = req.session.userId
    const addressId = req.query.addressId
    console.log(addressId);

    const profileExist = await profileModel.findOne({userId})

    const address = profileExist.newadress.find((address)=> address._id == addressId )

    res.status(200).json({address})
            
    } catch (error) {
        console.log('Error in select address');    
    }
}


exports.selectCoupon = async (req,res) =>{
    try {

    const userId = req.session.userId

    const couponId = req.query.couponId
    const subTotal = req.query.subTotal

    const findCoupon = await couponModel.findById(couponId)
    const discount = findCoupon.discount
    const couponDiscountPrice = (subTotal*discount)/100

    res.status(200).json({couponDiscountPrice,discount})
            
    } catch (error) {
        console.log('Error in select coupon');    
    }
}