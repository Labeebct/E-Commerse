const mongoose = require('mongoose')

const Schema = mongoose.Schema


const sub = {
    name: {
        type: String,
        required: true
    }
}




const categorySchema = new Schema({
    categoryname:{
        type:String,
        required:true
    },
    subcategory:[sub],
    catimageUrl:{
        type:String,
        required:true
    }
})


module.exports = new mongoose.model('category',categorySchema)

 