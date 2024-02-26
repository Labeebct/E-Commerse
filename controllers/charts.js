const signupModel = require('../models/signup')
const adminDatas = require('../models/admin_signup')
const productModel = require('../models/products')
const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')
const messageModel = require('../models/message')
const orderModel = require('../models/order')


exports.getSaleschart =(req,res) => {
    try {
        res.json({})
    } catch (error) {
        console.log('Error in get sales chart',chart);
    }
}



exports.getCustomerschart =(req,res) => {
    try {
        res.json({})
        
    } catch (error) {
        console.log('Error in get customers chart',chart);
    }
}




exports.getStockchart = async(req,res) => {
    try {

        const stockData = await productModel.aggregate([
            {
                $group:{
                 _id:'$category',
                 totalStock:{$sum:'$stock'}
            }
          }
        ])

        const labels = stockData.map((data)=> data._id)
        const data = stockData.map((data)=> data.totalStock)

        res.json({labels,data})

        
    } catch (error) {
        console.log('Error in get product stock chart',chart);
    }
}