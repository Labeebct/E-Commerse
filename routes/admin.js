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





//  ADD PRODUCT --------------------------

router.get('/products',controller.getProducts)
router.get('/product/add_product',controller.getAddproducts)
router.post('/product/add_product', upload.array('productimg', 5), controller.postAddproduct);





// USERS MANAGE

router.get('/custumers',controller.getUsers)
router.get('/custumer',controller.getCustomer)
router.delete('/custumer/remove',controller.deleteUsers)








router.get('/orders_list',controller.getOrders)

router.get('/customer/order_list/:id')


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