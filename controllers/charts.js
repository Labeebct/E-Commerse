const signupModel = require('../models/signup')
const adminDatas = require('../models/admin_signup')
const productModel = require('../models/products')
const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')
const messageModel = require('../models/message')
const orderModel = require('../models/order')
const moment = require('moment');


exports.getSaleschart = async (req, res) => {
    try {
        const currentDate = new Date();
        
        const startDate = moment(currentDate).subtract(2, 'months').startOf('month').toDate();
        const endDate = moment(currentDate).endOf('month').toDate();
        
        
        const resultData = await orderModel.aggregate([
            { 
              $match: { 
                "products.order_date": { $gte: startDate, $lte: endDate } 
              } 
            },
            {
              $unwind: "$products"
            },
            {
              $group: {
                _id: {
                  year: { $year: "$products.order_date" },
                  month: { $month: "$products.order_date" }
                },
                count: { $sum: 1 }
              }
            },
            {
                $project: {
                  _id: 0,
                  monthYear: {
                    $dateToString: {
                      format: "%Y-%m",
                      date: {
                        $dateFromString: {
                          dateString: { 
                            $concat: [
                              { $toString: "$_id.year" }, 
                              "-", 
                              { $toString: "$_id.month" }, 
                              "-01"
                            ] 
                          }
                        }
                      }
                    }
                  },
                  count: 1
                }
              },
            { $sort: { monthYear: 1 } }
          ]);
          


        const labels = resultData.map(item => item.monthYear);
        const countData = resultData.map(item => item.count);

        res.json({ labels, countData });
    } catch (error) {
        console.error('Error in fetching orders data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.getCustomerschart = async(req,res) => {
    try {

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        
        const moment = require('moment');

        const startDate = moment(`${currentYear}-${currentMonth}-01`, 'YYYY-MM-DD').toDate();
        const endDate = moment(`${nextYear}-${nextMonth}-01`, 'YYYY-MM-DD').toDate();
        
        const resultData = await signupModel.aggregate([
            {
                $addFields: {
                    regdate: {
                        $toDate: "$regdate"
                    }
                }
            },
            {
                $match: {
                    regdate: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$regdate" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);
        
                
        res.json({resultData}) 

    } catch (error) {
        console.log('Error in get customers chart',error);
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