const express = require('express')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()
const nocache = require('nocache')
const twilio = require('twilio')

    
const app = express()
const PORT = process.env.PORT || 8080

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(flash())

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}))
  
app.set('view engine','ejs')
app.set('views','views')


app.use('/',userRouter)
app.use('/admin',adminRouter)



mongoose.connect('mongodb://localhost:27017/CART_1M')
.then(()=>{
    app.listen(PORT,()=> console.log('Servere CONNECTED',PORT))
    console.log('Database Connected Succes')
})
.catch((err)=> console.log('Database Connection Failed',err))
