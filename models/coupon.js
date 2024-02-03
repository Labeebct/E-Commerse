
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
        couponnname: {
            type: String,
            required: true
        },
        minamount: {
            type: Number,
            required: true
        },
        maxamount: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        startdate:{
            type:Date,
            required:true
        },
        enddate:{
            type:Date,
            required:true
        }
    }); 


module.exports = new mongoose.model('coupons',couponSchema)