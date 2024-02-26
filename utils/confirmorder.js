const orderModel = require('../models/order')
const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const profileModel = require('../models/profile')
const signupModel = require('../models/signup')
const { ObjectId } = require('mongodb');

const { Types } = require('mongoose')

const nodemailer = require("nodemailer");

const otp = Math.round(Math.random() * 10000)



const sendingEmail = process.env.GMAIL
const appPassword = process.env.APP_PASSWORD

let counter=0;


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sendingEmail ,
    pass: appPassword,
  },
});



async function orderConfirm(userMail) {
    
    

   try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: userMail,
        subject: "Order Confirmation",
        text: `
        Subject: Order Confirmation: Your Secret Code for LABIO

        Dear ${userMail},

        Your secret code for order confirmation is: ${otp}

        Please keep this code confidential and refrain from sharing it with anyone else. This code is crucial for confirming your order and ensuring its security.

        If you have any questions or concerns regarding your order or this secret code, please don't hesitate to reach out to our customer support team at [support email].

        Thank you for choosing LABIO!

        Warm regards,


        Labeeb ct
        LABIO Customer Support Team
        `

      });
      
      console.log(`${otp} otp send to ${userMail}`);

  
    } catch (error) {
        console.log(error.message);
    }
}





const verify = async(postOtp,res,req) => {

  try {


    if(otp === parseInt(postOtp)){ 

      const userId = req.session.userId
      const userObjId = new Types.ObjectId(userId)
      const order = req.session.order
      const orderedProducts = order.products

      const userExistOrder = await orderModel.findOne({userId})

       if(!userExistOrder){

        const orderSchema = new orderModel({
          userId:userObjId,
          products : orderedProducts
        })

        await orderSchema.save()

        const update = await Promise.all(orderedProducts.map(async (product) => {

          await orderModel.updateOne(
              { userId, "products.productId": product.productId }, // Updating pending status to confirmed
              { $set: { "products.$.status": "confirmed" } }
          );

          await cartModel.updateOne(  
            {userId,"products.productId": product.productId._id },
            {$pull:{products:{productId:product.productId._id}}}  // Removing ordered product from cart
          )
          
          await productModel.updateOne(
            {_id:product.productId._id},
            {$inc:{stock:-product.quantity}}
          )
          

        }));

        if(update){
          delete req.session.order;
        }

        return res.status(200).json({success:true})

      }
      else{

      const update = await Promise.all(orderedProducts.map(async (product) => {

          await orderModel.updateOne({ userId }, { $push: { products: product } });

          await orderModel.updateOne(
            { userId, "products.productId": product.productId }, // Updating pending status to confirmed
            { $set: { "products.$.status": "confirmed" } }
          );

          await cartModel.updateOne(  
            {userId,"products.productId": product.productId._id }, // Removing ordered product from cart
            {$pull:{products:{productId:product.productId._id}}}
          )

          await productModel.updateOne(
            {_id:product.productId._id},
            {$inc:{stock:-product.quantity}}
          )
          
        }));


        if(update){
          delete req.session.order;
        }

        return res.status(200).json({success:true})
      }

  }
  else{
      
      if(counter ==3){
         delete req.session.order;
         return res.status(250).json({success:false,limiteexeed:true})
      }
      counter++

      res.status(250).json({success:false})
  }

    
  } catch (error) {
    console.log('Error in order save',error);
  }
}



module.exports = {orderConfirm , verify}