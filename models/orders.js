const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ordersSchema = new Schema(
    {
     userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        shipping_adress: {
            type: String,
            required: true
        },
        payment_methode: {
            type: String,
            required: true
        },
        total_amount: {
            type: String,
            required: true
        },
        order_date: {
            type: Date
        }
    }]
    }
 ); 


 module.exports = new mongoose.model('orders',ordersSchema)