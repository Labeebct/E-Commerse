const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    categoryname:{
        type:String,
        required:true
    },
    subcategory:{
        type:Array,
        required:true
    },
    catimageUrl:{
        type:String,
        required:true
    }
})


module.exports = new mongoose.model('category',categorySchema)

 