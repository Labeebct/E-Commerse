const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const addressSchema = new Schema({
   firstname: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   mobilenum:{
      type: Number,
      required: true
   },
   country: {
      type: String,
      required: true
   },
   state: {
      type: String,
      required: true
   }, 
   district: {
      type: String,
      required: true
   },
   address:{
      type: String,
      required: true
   },
   zip: {
      type: String,
      required: true
   }
})




const profileSchema = new Schema({
   firstname: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   photo:{
      type:String,
      required:true
   },
   DOB:{
      type:Date,
      required:true
   },
   country: {
      type: String,
      required: true
   },
   state: {
      type: String,
      required: true
   }, 
   district: {
      type: String,
      required: true
   },
    address:{
        type: String,
        required: true
    }, 
    landmark: {
        type: String,
        required: true
    },
    zip:{
        type: Number,
        required: true
    },
    newadress:[addressSchema],
    userId:{
      type: Schema.Types.ObjectId,
      required: true
   } },{ timestamps: true }); 


module.exports = new mongoose.model('profile',profileSchema)



