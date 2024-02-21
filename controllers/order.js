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
        
        let cartTotal;
        let cartPrice;

        const state = ''
        const userId = req.session.userId

        let productArray=[];
        
        const productId = req.query.product
        const cartId = req.query.cart


        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
        
        // Checking whether profile exist or not
        
        const profileExist = await profileModel.findOne({userId})
        const signupData = await signupModel.findById(userId)

        const cartQuantity = cartExist ? cartExist.products : []

        const userAddress = profileExist? profileExist.newadress : []
                 
        if(!req.session.loggedin){
            return res.redirect('/login')
        }     

        if(!profileExist){   
            return res.redirect('/account/address')
        }
        // checking cart or whixhlist exist for showing cart and wishlist count

        const cart = await cartModel.find({userId}).populate('products.productId')
        const cartProducts = cart ? cart[0].products : []

        if(productId){
          const findProduct = await productModel.findById(productId)

          const productObj = {
            productId: findProduct,
            quantity:1,
          }

          const discount = Math.round(findProduct.newprice * .05) //calculating discount for product in cart
          const gst = findProduct.newprice * .01
          
          cartTotal = Math.round(Number(findProduct.newprice - discount + gst))
          cartPrice = findProduct.newprice

          productArray.push(productObj)
        }
        else{   
          productArray = cartProducts

         cartPrice = cartProducts.reduce((acc,item)=>{
           return acc + (item.productId.newprice * item.quantity)
        },0)

        const discount = Math.round(cartPrice * .05) //calculating discount for product in cart
        const gst = cartPrice * .01

        cartTotal = Math.round(Number(cartPrice - discount + gst))
    
        }

        const coupons = await couponModel.find({
            minamount:{ $lte: cartTotal},
            maxamount:{$gte: cartTotal},
            avalability:"forallusers",
            startdate: { $lte: new Date() },
            enddate: { $gte: new Date() } 
        });

               
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
          coupons,
          cartPrice,
        })
    
    } catch (error) {
        console.log('Error in order Summury get',error);
    }

}  





exports.postCheckout = (req,res) => {
  try {

    const { order } = req.body
    console.log(order);
    
  } catch (error) {
    console.log('Error in post checkout');
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

    const profileExist = await profileModel.findOne({userId})

    const address = profileExist.newadress.find((address)=> address._id == addressId )

    res.status(200).json({address})
            
    } catch (error) {
        console.log('Error in select address');    
    }
}


exports.applyCoupon = async (req,res) =>{
    try {
         
    const userId = req.session.userId

    const couponId = req.query.couponId
    const subTotal = req.query.subTotal

    const findCoupon = await couponModel.findById(couponId)
    const discount = findCoupon.discount
    const couponDiscountPrice = (subTotal*discount)/100

    res.status(200).json({success:true,couponDiscountPrice,discount})
            
    } catch (error) {
        console.log('Error in select coupon');    
    }
}


exports.selectCoupon = async (req,res) =>{
    try {
         
    const userId = req.session.userId

    const coponCode = req.query.coponCode
    const subTotal = req.query.subTotal

    const coupon = await couponModel.findOne({
        couponnname: coponCode,
        avalability:"limited",
        minamount:{ $lte: subTotal},
        startdate: { $lte: new Date() },
        enddate: { $gte: new Date() } 
    })

    const discount = coupon ? coupon.discount : 0
    const couponDiscountPrice = (subTotal*discount)/100

    res.status(200).json({coupon,couponDiscountPrice})
            
    } catch (error) {
        console.log('Error in select coupon');    
    }
}