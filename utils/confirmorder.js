const orderModel = require('../models/order')
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
        text: `Your secret code for the order confirmation in LABIO is ${otp}.Please don't share this code with anyone else. `

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

        await Promise.all(orderedProducts.map(async (product) => {

          await orderModel.updateOne(
              { userId, "products.productId": product.productId._id },
              { $set: { "products.$.status": "confirmed" } }
          );

        }));

        delete req.session.order;
        
        return res.status(200).json({success:true})

      }
      else{

        await Promise.all(orderedProducts.map(async (product) => {

          await orderModel.updateOne({ userId }, { $push: { products: product } });

          await orderModel.updateOne(
            { userId, "products.productId": product.productId },
            { $set: { "products.$.status": "confirmed" } }
          );

        }));

        delete req.session.order;

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