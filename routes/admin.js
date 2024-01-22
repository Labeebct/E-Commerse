const express = require('express')
const router = express.Router()
const controller = require('../controllers/admin')






router.get('/signup')
router.post('/signup')


router.get('/key_verification')
router.post('/key_verification')


router.get('/home')

router.get('/orders_list')

router.get('/custumers')
router.get('/custumer/:id')
router.delete('/custumer/remove/:id')

router.get('/customer/order_list/:id')

router.get('/products')

router.get('/product/add_product')
router.post('/product/addproduct')

router.delete('/product/remove_product/:id')

router.get('/product/editproduct')
router.put('/product/editproduct')


router.get('/category')

router.get('/category/add_category')
router.post('/category/add_category')
router.delete('/category/deletecategory/:id')


router.get('/category/edit_category/:id')
router.put('/category/edit_category/:id')


router.get('/coupons')
router.get('/coupons/add_coupon')
router.post('/coupons/add_coupon')

router.get('/coupons/edit_coupon/:id')
router.put('/coupons/edit_coupon/:id')

router.post('/coupons/remove_coupon/:id')


router.get('/messages')
router.get('/messages/user_message/:id')


router.get('/banners')
router.post('/banners/add_banners')






module.exports = router