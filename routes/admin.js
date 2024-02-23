const express = require('express')
const router = express.Router()
const controller = require('../controllers/admin')


const upload = require('../middleware/multer')






// <<<<< ============== AUTHENTICATION =============== >>>>>






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







// <<<<< ================== HOME ====================== >>>>>
 




// ADMIN HOME ----------------------------


router.get('/home',controller.getHome)


      
   
//  PRODUCT --------------------------

    

router.get('/products',controller.getProducts)
router.get('/product/add_product',controller.getAddproducts)
router.post('/product/add_product',upload.array('productimg', 20), controller.postAddproduct);

router.get('/product/edit_product/:id',controller.getEditproduct)
router.post('/product/edit_product/:id',upload.array('productimg', 20),controller.postEditproduct)

router.delete('/product/remove_product',controller.deleteProduct)

router.get('/product/product_deltails',controller.getOpenproduct)




// USERS MANAGE -----------------------------


router.get('/custumers',controller.getUsers)
router.get('/custumer/:id',controller.getCustomer)
router.delete('/custumer/remove',controller.deleteUsers)





// CATEGORY -----------------------------


router.get('/category',controller.getCategory)
router.get('/category/add_category',controller.getAddcategory)
router.post('/category/add_category',controller.postAddcategory)
router.get('/category/edit_category/:id',controller.getEditcategory)
router.post('/category/edit_category/:id',controller.postEditcategory)
router.delete('/category/remove_sub_category/:id/:index',controller.deleteSubcat)
router.delete('/category/deletecategory',controller.deletCategory)




//BANNER -----------------------------

router.get('/banners',controller.getBanners)
router.get('/banners/add_banners',controller.getAddbanner)
router.post('/banners/add_banners',upload.single('bannerimg'),controller.postAddbanner)

router.get('/banners/edit_banner/:id',controller.getEditbanner)
router.post('/banners/edit_banner/:id',upload.single('bannerimg'),controller.postEditbanner)

router.delete('/banners/remove_banners',controller.deleteBanner)





// COUPONS -----------------------------


router.get('/coupons',controller.getCoupons)
router.get('/coupons/add_coupon',controller.getAddcoupons)
router.post('/coupons/add_coupon',controller.postAddcoupons)

router.get('/coupons/edit_coupon/:id',controller.getEditcoupons)
router.post('/coupons/edit_coupon/:id',controller.postEditcoupons)

router.delete('/coupons/remove_coupon',controller.deleteCoupon)




// MESSAGES -----------------------------

router.get('/messages',controller.getMessages)
router.get('/messages/user_message/:id',controller.getUsermessage)





router.get('/orders_list',controller.getOrders)
router.put('/change_order_status',controller.getOrderstatus)

router.get('/customer/order_list/:id')






module.exports = router