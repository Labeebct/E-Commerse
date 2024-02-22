const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productObj = {
    productId: {
        type: String,
        required: true,
        ref:'products'
    },
    category: {
        type: String,
        required: true
    },
    quantity:{
        type:Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    shipping_adress: {
        type: String,
        required: true,
    },
    payment_methode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
    }}

const orderSchema = new Schema({

     userId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      products: [productObj]
    
}); 



module.exports = new mongoose.model('orders',orderSchema)