const mongoose = require('mongoose');
const products = require('./products');
const Schema = mongoose.Schema;


const cartElement = {
    productId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'products'
    },
    quantity:{
        type:Number,
        required:true
    }
}


const cartSchema = new Schema({
   userId:{
    type:Schema.Types.ObjectId,
    required:true
   },
   products:[cartElement]
},{ timestamps: true })


module.exports = new mongoose.model('cart',cartSchema)