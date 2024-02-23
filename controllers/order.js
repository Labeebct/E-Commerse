const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const profileModel = require('../models/profile')
const signupModel = require('../models/signup')
const couponModel = require('../models/coupon')
const orderModel = require('../models/order')
const { ObjectId } = require('mongodb');
const { Types } = require('mongoose')

const {orderConfirm , verify} = require('../utils/confirmorder')


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
                 
        if(!req.session.loggedin){
            return res.redirect('/login')
        }     

        if(!profileExist){   
            return res.redirect('/account/address')
        }
        // checking cart or whixhlist exist for showing cart and wishlist count

        const cart = await cartModel.findOne({userId}).populate('products.productId')
        // const cartProducts = cart ? cart[0].products : []
        const cartProducts = cart ? cart.products.filter((product)=> product.productId.stock > 0) : []

        const userAddress = profileExist.newadress

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

    req.session.order = order
    
    res.status(200).json({success:true})
    
  } catch (error) {
    console.log('Error in post checkout',error);
  }
}



exports.getConfirmOtp = async(req,res) => {
  try {

    if(!req.session.loggedin){
      return res.redirect('/login')
   }   

    const state = ''
    const userId = req.session.userId
    const email = req.session.email


    const cartExist = await cartModel.findOne({userId})
    const wishExist = await wishlistModel.findOne({userId})

    res.render('user/pages/confirmorderotp',
    {
      state,cartCount: cartExist? cartExist.products.length : 0,
      wishCount: wishExist? wishExist.products.length : 0,
      email,
    }
    )
    
  } catch (error) {
    console.log('Error in order otp',error);
  }
}
    



exports.postConfirmOtp = (req,res) => {
  try {

    const {D1,D2,D3,D4} = req.body  
    const code = D1+D2+D3+D4

    verify(code,res,req)

    
  } catch (error) {
    console.log('Error in order otp',error);
  }
}




exports.getSummary = async(req,res) => {

  try {

    const userId = req.session.userId
    const order = req.session.order

    if(!req.session.loggedin){
        return res.redirect('/login')
    }     

    const profileExist = await profileModel.findOne({userId})
    const cartExist = await cartModel.findOne({userId})
    const wishExist = await wishlistModel.findOne({userId})
     
    const cart = await cartModel.find({userId}).populate('products.productId')
    const cartProducts = cart ? cart[0].products : []

    const address =  profileExist.newadress.find((address) => address._id == order.address )
    const paymentMethode = order.paymentmethode
    const couponDiscount = order.coupon
    const orderTotal = order.totalamount


    const orderProductDetails = await Promise.all(order.products.map(async (product) => {
      product.productId = await productModel.findOne({_id: product.productId});
      return product;
    }));
  
    const cartPrice = cartProducts.reduce((acc,item)=>{
        return acc + (item.productId.newprice * item.quantity)
     },0)

    const discount = Math.round(cartPrice * .05) //calculating discount for product in cart
    const gst = cartPrice * .01

    cartTotal = Math.round(Number(cartPrice - discount + gst))


    res.render('user/pages/ordersummary',
    {
        state:'',
        cartCount: cartExist? cartExist.products.length : 0,
        wishCount: wishExist? wishExist.products.length : 0,
        address,
        paymentMethode,
        cartTotal,
        couponDiscount,
        orderTotal,
        orderProductDetails
    })

  } catch (error) {
    console.log('Error in get summary');
  }
}




exports.postProceedtoPay = (req,res) => {
  try {
    
    const order = req.session.order
    const email = req.session.email

    if(order.paymentmethode === 'card'){
      res.send('cardddddd')
    }
    else if(order.paymentmethode === 'upi'){
      res.send('upiiii')
    }
    else{
      orderConfirm(email)
      res.redirect('/confirm_order')
    }

  } catch (error) {
    console.log('Error in proceed to pay',error);
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
        console.log('Error in select address',error);    
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
        console.log('Error in select coupon',error);    
    }
}