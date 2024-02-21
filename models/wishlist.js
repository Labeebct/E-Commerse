const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const wishElements = {
    productId:{
        type:Schema.Types.ObjectId,      
        required:true
    }
}


const wishSchema = new Schema({
    userId:{
    type:Schema.Types.ObjectId,
    required:true
   },
   products:[wishElements]
})



module.exports = new mongoose.model('wishlist',wishSchema)