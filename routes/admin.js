const express = require('express')
const router = express.Router()
const controller = require('../controllers/admin')




// <<<<< ============== AUTHENTICATION =============== >>>>>




router.get('/signup',controller.getSignup)
router.post('/signup',controller.postSignup)   

router.get('/login',controller.getLogin)
router.post('/login',controller.postLogin)



router.get('/key_verification/:email',controller.getKeyverify)
router.post('/key_verification/:email',controller.postKeyverify)





// <<<<< ================== HOME ====================== >>>>>





router.get('/home',controller.getHome)

router.get('/orders_list',controller.getOrders)

router.get('/custumers',controller.getUsers)
router.get('/custumer',controller.getCustomer)
router.delete('/custumer/remove/:id')

router.get('/customer/order_list/:id')

router.get('/products',controller.getProducts)

router.get('/product/add_product',controller.getAddproducts)
router.post('/product/addproduct')

router.delete('/product/remove_product/:id')

router.get('/product/editproduct')
router.put('/product/editproduct')


router.get('/category',controller.getCategory)

router.get('/category/add_category',controller.getAddcatogery)
router.post('/category/add_category')
router.delete('/category/deletecategory/:id')


router.get('/category/edit_category/:id')
router.put('/category/edit_category/:id')


router.get('/coupons',controller.getCoupons)
router.get('/coupons/add_coupon',controller.getAddcoupons)
router.post('/coupons/add_coupon')

router.get('/coupons/edit_coupon/:id')
router.put('/coupons/edit_coupon/:id')

router.post('/coupons/remove_coupon/:id')


router.get('/messages',controller.getMessages)
router.get('/messages/user_message',controller.getUsermessage)


router.get('/banners',controller.getBanners)
router.get('/banners/add_banners',controller.getAddbanner)
router.post('/banners/add_banners')






module.exports = router