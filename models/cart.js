const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartElement = {
    productid:{
        type:Schema.Types.ObjectId,
        required:true
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
})


module.exports = new mongoose.model('cart',cartSchema)