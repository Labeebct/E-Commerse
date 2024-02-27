const express = require('express')
const router = express.Router()
const userLoggedSesssion = require('../middleware/usersession')

const homeController = require('../controllers/userHome')             
const accountController = require('../controllers/account') 
const authController = require('../controllers/userAuth')
const cartController = require('../controllers/cart')
const wishController = require('../controllers/wishlist')
const orderController = require('../controllers/order')

const upload = require('../middleware/multer')


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


//HOME-
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
router.get('/cart/increase_quantity',cartController.getIncreaseQuantity)
router.use(userLoggedSesssion)  // ROUTES BELOW ONLY WORKS IF USER LOGGED IN



//PROFILE ------------------------
router.get('/account/address',accountController.getAdress)
router.post('/account/add_address',upload.single('profileimg'),accountController.postAddress)
router.get('/account/editaddress',accountController.getEditaddress)
router.post('/account/editaddress',upload.single('profileimg'),accountController.posEditAddress)
router.post('/ratind_and_review',accountController.postRatingReview)



// UPDATE PASSWORD -----------------
router.get('/account/update_password',accountController.getUpdatepassword)
router.put('/account/update_password',accountController.postUpdatepassword)



// CONTACT ------------------------
router.get('/account/contactus',accountController.getContactus)
router.post('/account/contactus',accountController.postContactus)


// ORDERS ------------------------
router.get('/account/orders',accountController.getOrder)
router.get('/account/order_details',accountController.getOrderOpen)
router.put('/cancel_order',accountController.putCancelorder)
router.get('/account/aboutus',accountController.getAboutus)



router.get('/checkout',orderController.getCheckout)
router.post('/checkout',orderController.postCheckout)

router.get('/summary',orderController.getSummary)

router.get('/confirm_order',orderController.getConfirmOtp)
router.post('/confirm_order_otp',orderController.postConfirmOtp)


router.post('/proceed_to_pay',orderController.postProceedtoPay)
router.post('/veryfy_payment',orderController.postRazorpay)


router.post('/checkout/add_new_adress',orderController.postAddnewadress)

router.get('/select_address',orderController.selectAddress)
router.get('/apply_coupon',orderController.applyCoupon)

router.get('/select_coupon',orderController.selectCoupon)
router.get('/order_success',orderController.getOrderSuccess)
  


// LOGOUT ------------------------
router.get('/logout',homeController.getLogout)



module.exports = router