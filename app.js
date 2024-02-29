const express = require('express')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
const nocache = require('nocache')
require('dotenv').config() /* Loading varibales to the file */
 

const app = express()
const PORT = process.env.PORT || 808


// Importing Routers
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public')) 
app.use(flash())


// Setting Session for AUthentication
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}))
  

// Setting template Engines
app.set('view engine','ejs')
app.set('views','views')


app.use('/admin',adminRouter)
app.use('/',userRouter)


// MongoDB connection & Server Listening
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@test.vkjl80y.mongodb.net/?retryWrites=true&w=majority&appName=TEST`)
.then(()=>{
    app.listen(PORT,()=> console.log('Server CONNECTED',PORT))
    console.log('Database Connected Succes')
})
.catch((err)=> console.log('Database Connection Failed',err))
