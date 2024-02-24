const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SignupDatas = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobilenum: {
    type: Number,
    required: true
  },
  verified:{
    type:Boolean,
    default:false
  },
  regdate:{
    type:String
  }
},{ timestamps: true });

module.exports = new mongoose.model('adminDatas',SignupDatas)