const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productDatas = new Schema({
  productname: {
    type: String,
    required: true
  },
  oldprice: {
    type: Number,
    required: true
  },
  newprice: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  productimg: {
    type: Array,
    default: false
  },
  size: {
    type: Array,
  },
  color: {
    type: Array
  },
  subcategory: {
    type: String,
    required: true
  },
  returns: {
    type: Boolean,
    default:false
  },
  stock:{
    type: Number,
    required: true
  },
  deliverywithin: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = new mongoose.model('products', productDatas)