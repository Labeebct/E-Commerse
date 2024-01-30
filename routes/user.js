const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')             
const accountController = require('../controllers/account') 




// <<<<<<< ============ AUTHENTICATION ========== >>>>>>>



router.get('/signup',controller.getSignup)
router.post('/signup',controller.postSignup)


router.get('/otp_verification/:num',controller.getOtpverification)
router.post('/otp_verification/:num',controller.postOtpverification)


router.get('/resend_otp/:num',controller.getResendotp)
router.get('/otp_success',controller.getOtpsuccess)


router.get('/login',controller.getLogin)
router.post('/login',controller.postLogin)


router.get('/forget_password',controller.getForgetpass)
router.post('/forget_password',controller.postForgetpass)


router.get('/email_otp',controller.getEmailOtp)
router.post('/email_otp',controller.postEmailOtp)


router.get('/change_password',controller.getChangepass)
router.post('/change_password',controller.postChangepass)


router.get('/resend_email_otp',controller.getResendemailotp)






// <<<<<<<============ HOME ===============>>>>>>







router.get('/home',controller.getHome)

router.get('/products/category/:category')

router.get('/products')

router.get('/product',controller.getProductopen)


router.get('/wishlist',controller.getWishlist)

router.get('/wishist/add/:id')

router.delete('/wishist/remove/:id')


router.get('/cart',controller.getCart)

router.get('/cart/add/:id')

router.delete('/cart/remove/:id')

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





// <<<<<<<============= ACCOUNT CONTOLLER ================>>>>>>>





router.get('/account/address',accountController.getAdress)
router.get('/account/editaddress',accountController.getEditaddress)

router.put('/account/address')


router.get('/account/update_password',accountController.getUpdatepassword)

router.put('/account/update_password/:id')

router.get('/account/orders',accountController.getOrder)


router.get('/account/aboutus',accountController.getAboutus)


router.get('/account/contactus',accountController.getContactus)
router.post('/account/contactus')



router.get('/logout')


module.exports = router