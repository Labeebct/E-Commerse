const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')
const accountController = require('../controllers/account')



router.get('/signup',controller.getSignup)
router.post('/signup')


router.get('/otp_registration')
router.post('/otp_registration')

router.get('/login',controller.getLogin)
router.post('/login')

router.get('/number_registration')
router.post('/number_registration')

router.get('/otp_registration')
router.post('/otp_registration')


router.get('/forget_password')
router.post('/forget_password')




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