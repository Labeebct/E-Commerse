const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')



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




router.get('/home')

router.get('/products/category/:category')

router.get('/products')

router.get('/product/:id')


router.get('/wishlist')

router.get('/wishist/add/:id')

router.delete('/wishist/remove/:id')


router.get('/cart')

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


router.get('/account/address')
router.put('/account/address')


router.get('/account/update_password')

router.put('/account/update_password/:id')

router.get('/account/orders')


router.get('/account/aboutus')

router.get('/account/contactus')
router.post('/account/contactus')



router.get('/logout')


module.exports = router