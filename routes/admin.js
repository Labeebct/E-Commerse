const express = require('express')
const router = express.Router()
const adminSession = require('../middleware/adminsession')
const controller = require('../controllers/admin')
const chartController = require('../controllers/charts')

const upload = require('../middleware/multer')

// SIGNUP -----------------------------
router.get('/signup',controller.getSignup)
router.post('/signup',controller.postSignup)   

// LOGIN -------------------------------
router.get('/login',controller.getLogin)
router.post('/login',controller.postLogin)

// KEY VERIFICATION -----------------------------------
router.get('/key_verification/:email',controller.getKeyverify)
router.post('/key_verification/:email',controller.postKeyverify)

// EMAIL VERIFICATION --------------------------------
router.get('/email_verify',controller.getEmailverify)
router.post('/email_verify',controller.postEmailverify)

// FORGET PASSWORD -----------------------------------
router.get('/forget_password',controller.getForgetpassword)
router.post('/forget_password',controller.postForgetpassword)

router.use(adminSession) // ROUTES BELOW IS ONLY ACCESIBLE IF ADMIN LOGGED IN

// ADMIN HOME ----------------------------
router.get('/home',adminSession,controller.getHome)
 
//  PRODUCT --------------------------
router.get('/products',adminSession,controller.getProducts)
router.get('/product/add_product',adminSession,controller.getAddproducts)
router.post('/product/add_product',adminSession,upload.array('productimg', 20), controller.postAddproduct);

router.get('/product/edit_product/:id',adminSession,controller.getEditproduct)
router.post('/product/edit_product/:id',adminSession,upload.array('productimg', 20),controller.postEditproduct)

router.delete('/product/remove_product',adminSession,controller.deleteProduct)

router.get('/product/product_deltails',adminSession,controller.getOpenproduct)



// USERS MANAGE -----------------------------
router.get('/custumers',adminSession,controller.getUsers)
router.get('/custumer/:id',adminSession,controller.getCustomer)
router.delete('/custumer/remove',adminSession,controller.deleteUsers)


// CATEGORY -----------------------------
router.get('/category',adminSession,controller.getCategory)
router.get('/category/add_category',adminSession,controller.getAddcategory)
router.post('/category/add_category',adminSession,controller.postAddcategory)
router.get('/category/edit_category/:id',adminSession,controller.getEditcategory)
router.post('/category/edit_category/:id',adminSession,controller.postEditcategory)
router.delete('/category/remove_sub_category/:id/:index',adminSession,controller.deleteSubcat)
router.delete('/category/deletecategory',adminSession,controller.deletCategory)




//BANNER -----------------------------
router.get('/banners',adminSession,controller.getBanners)
router.get('/banners/add_banners',adminSession,controller.getAddbanner)
router.post('/banners/add_banners',adminSession,upload.single('bannerimg'),controller.postAddbanner)

router.get('/banners/edit_banner/:id',adminSession,controller.getEditbanner)
router.post('/banners/edit_banner/:id',adminSession,upload.single('bannerimg'),controller.postEditbanner)

router.delete('/banners/remove_banners',adminSession,controller.deleteBanner)



// COUPONS -----------------------------
router.get('/coupons',adminSession,controller.getCoupons)
router.get('/coupons/add_coupon',adminSession,controller.getAddcoupons)
router.post('/coupons/add_coupon',adminSession,controller.postAddcoupons)

router.get('/coupons/edit_coupon/:id',adminSession,controller.getEditcoupons)
router.post('/coupons/edit_coupon/:id',adminSession,controller.postEditcoupons)

router.delete('/coupons/remove_coupon',adminSession,controller.deleteCoupon)



// MESSAGES -----------------------------
router.get('/messages',adminSession,controller.getMessages)
router.get('/messages/user_message/:id',adminSession,controller.getUsermessage)


// ORDERS -----------------------------
router.get('/orders_list',adminSession,controller.getOrders)
router.put('/change_order_status',adminSession,controller.getOrderstatus)



// CHARTS -----------------------------
router.get('/sales_chart',chartController.getSaleschart)
router.get('/customers_chart',chartController.getCustomerschart)
router.get('/stocks_chart',chartController.getStockchart)



router.get('/logout',controller.getLogout)


module.exports = router