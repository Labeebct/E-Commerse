const express = require('express')
const router = express.Router()
const homeController = require('../controllers/userHome')             
const accountController = require('../controllers/account') 
const authController = require('../controllers/userAuth')
const cartController = require('../controllers/cart')
const wishController = require('../controllers/wishlist')
const orderController = require('../controllers/order')



const upload = require('../middleware/multer')


   

// <<<<<<< ====================== AUTHENTICATION ======================== >>>>>>>




// SIGNUP -----------------------------


router.get('/signup',authController.getSignup)
router.post('/signup',authController.postSignup)


// OTP VERIFICATION -------------------

router.get('/otp_verification/:num',authController.getOtpverification)
router.post('/otp_verification/:num',authController.postOtpverification)



// RESEND OTP --------------------------

router.get('/resend_otp/:num',authController.getResendotp)
router.get('/otp_success',authController.getOtpsuccess)


//  LOGIN ------------------------------


router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)



// FORGET PASSWORD ----------------------

router.get('/forget_password',authController.getForgetpass)
router.post('/forget_password',authController.postForgetpass)



// EMAIL OTP ----------------------------

router.get('/email_otp',authController.getEmailOtp)
router.post('/email_otp',authController.postEmailOtp)



// CHANGE PASSWORD ------------------------

router.get('/change_password',authController.getChangepass)
router.post('/change_password',authController.postChangepass)



// RESEND EMAIL OTP --------------------------

router.get('/resend_email_otp',authController.getResendemailotp)






// <<<<<<<=========================== HOME ===================================>>>>>>





router.get('/home',homeController.getHome)
router.get('/category/:cat',homeController.getCategory)
router.get('/subcategory/:subcat',homeController.getSubcategory)
router.get('/product',homeController.getProductopen)
router.get('/all_products',homeController.getAllproducts)
router.get('/all_products/show',homeController.getShowAllproducts)


       

// WIDHLIST -------------------------

router.get('/wishlist',wishController.getWishlist)
router.post('/wishist/add',wishController.postAddwishlist)
router.post('/wishlist/to_cart',wishController.postFromwishToCart)
router.delete('/wishist/remove',wishController.deleteWishlist)




// CART ----------------------------

router.get('/cart',cartController.getCart)
router.post('/cart/add',cartController.postAddCart)
router.delete('/cart/remove',cartController.postRemoveCart)




// <<<<<<<========================= ORDER ==============================>>>>>>>



// ORDER

router.post('/cart/add_coupon/:id')

router.get('/checkout')
router.post('/checkout/new_adress')
router.post('/checkout/payment_method')

router.post('/checkout')

router.get('/order_summary')
    

router.get('/payment_process')
router.post('/payment_process')

router.get('/confirm_order')

router.get('/order_success')



    


// <<<<<<<========================= ACCOUNT ==============================>>>>>>>






//PROFILE ------------------------


router.get('/account/address',accountController.getAdress)
router.post('/account/add_address',upload.single('profileimg'),accountController.postAddress)
router.get('/account/editaddress',accountController.getEditaddress)
router.post('/account/editaddress',upload.single('profileimg'),accountController.posEditAddress)



// UPDATE PASSWORD -----------------


router.get('/account/update_password',accountController.getUpdatepassword)
router.put('/account/update_password',accountController.postUpdatepassword)



// CONTACT ------------------------


router.get('/account/contactus',accountController.getContactus)
router.post('/account/contactus',accountController.postContactus)


// ORDERS ------------------------


router.get('/account/orders',accountController.getOrder)
router.get('/account/aboutus',accountController.getAboutus)



// LOGOUT ------------------------


router.get('/logout')



module.exports = router