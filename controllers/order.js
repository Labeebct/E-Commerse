const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const { ObjectId } = require('mongodb');

const { Types } = require('mongoose')




exports.getOrderSummary = async(req,res) => {

    try {
        
        const state = ''
        const userId = req.session.userId
    
        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
       
         res.render('user/pages/ordersummary',{state,ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
    
    } catch (error) {
        console.log('Error in order Summury get',error);
    }

}


exports.getCheckout = async(req,res) => {

    try {
        
        const state = ''
        const userId = req.session.userId
    
        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
       
         res.render('user/pages/checkout',{state,ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
    
    } catch (error) {
        console.log('Error in order Summury get',error);
    }

}

