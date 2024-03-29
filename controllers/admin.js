const bcrypt = require('bcrypt')
const moment = require('moment')
const fs = require('fs')

const signupModel = require('../models/signup')
const adminDatas = require('../models/admin_signup')
const productModel = require('../models/products')
const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')
const messageModel = require('../models/message')
const orderModel = require('../models/order')

//Nodemailer function to send email
const  {blockMessage,unblockMsg} = require('../utils/blockmsg')
const { deliveredMsg , sippedMsg } = require('../utils/orderStatus')

const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/

exports.getSignup = (req, res) => {
    res.render('admin/pages/signup')
}

exports.postSignup = async(req, res) => {
    try {

        const { username , email , mobilenum , password} = req.body

        //Hashing with Salting
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)   

        const originalDate = moment().format('DD-MM-YYYY')
    
        const userNumExist = await adminDatas.findOne({email})
        const userEmailExist = await adminDatas.findOne({mobilenum})


        if(userNumExist || userEmailExist){    /* Checking whether user exist or not */

        const verifyUser = userNumExist.verified
   
        if(verifyUser){      /* checking whether user verified or not */
   
         console.log('user exist');
         return res.status(403).json({error:'User Already Exist'})
   
        } else {
          return res.status(200).json({email}) /* Passing email for params to get OTP verifypage */
        }
       }
       else{
        const newSchema = new adminDatas({
           username,
           email,
           mobilenum,
           password:hashedPassword,
           regdate:originalDate
        })
    
        await newSchema.save()
        res.status(200).json({email})
        }
    
    } catch (error) {
        console.log('Error in admin signup',error.message); 
        res.status(500).send('Internal server Error')
    }
}

exports.getKeyverify = (req, res) => {

    const email = req.params.email
    const errMsg = req.flash('wrongkey')
    res.render('admin/pages/key_verify',{email,errMsg})
}

exports.postKeyverify = async(req,res) => {

    try {
        const secretKey = process.env.KEY_VERIFY
        const {password} = req.body
        const email = req.params.email

        if(!password){
            req.flash('wrongkey',"Please Enter the KEY")
            return res.redirect(`/admin/key_verification/${email}`)

        } else {

        if(secretKey==password){
          const verifyAdmin = await adminDatas.updateOne({email},
          {$set:{verified:true}}
        )

          if(verifyAdmin){
            res.redirect('/admin/login')
          }
        }
        else{
            req.flash('wrongkey',"Incorrect Verification KEY")
            return res.redirect(`/admin/key_verification/${email}`)
        }
      }
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in admin keyvrification',error.message);
    }
}

exports.getLogin = (req, res) => {
    res.render('admin/pages/login')
}

exports.postLogin = async(req,res) => {
     
    try {
         const { email , password} = req.body
         const userExist = await adminDatas.findOne({email})  /* Finding user with email */


         if(email == '' || password == ''){  /* Checking whether fields is empty */

              return res.status(402).json({error:'Please all Fields'})
         }
         else if(!emailRegex.test(email)){  /* Checking email format  */

              return res.status(402).json({error:'Invalid Email Format'})
         }

         if(!userExist){
              return res.status(402).json({error:'User not Exist'})         
         }else{

         const hashedPassword = userExist.password
         const comparePass = await bcrypt.compare(password,hashedPassword)  /* Comparing passwords */

         if(comparePass){

            if(userExist.verified){
            req.session.admin = true
            return res.status(200).json({auth:true})
            } else {
                return res.status(200).json({auth:false,email})    
            }
         }
         else{
              return res.status(402).json({error:'Incorrect Password'})         
         }
         }
    } catch (error) {
         res.status(500).send('Internal server Error')
         console.log('Error in post Login',error.message);
    }
}

exports.getEmailverify = (req,res) => {
    const errMsg = req.flash('errMsg') 
    res.render('admin/pages/emailverify',{errMsg})
}

exports.postEmailverify = async(req,res) => {
   
    try {
        if(req.body.email===''){
          req.flash('errMsg',"Please Enter the Email")
          return res.redirect('/admin/email_verify')
        }
        else if(!emailRegex.test(req.body.email)){
         req.flash('errMsg',"Invalid Email Format")
          return res.redirect('/admin/email_verify')
        }
        
        const userExist = await adminDatas.findOne({email:req.body.email})

        if(!userExist){
             req.flash('errMsg',"Accound with email not Exist")
             return res.redirect('/admin/email_verify')
        }
        else{
          return res.redirect('/admin/forget_password') 
        }
        
   } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post forget password',error.message);
   }
}

exports.getForgetpassword = (req, res) => {
    const errMsg = req.flash('wrongkey')
    res.render('admin/pages/forgetpass',{errMsg})
}



exports.postForgetpassword = async(req,res) => {
    try {
        const secretKey = process.env.KEY_VERIFY
        const {password} = req.body

        if(!password){
            req.flash('wrongkey',"Please Enter the Verification KEY")
            return res.redirect(`/admin/forget_password`)
        }
        if(secretKey==password){
            req.session.admin = true
            res.redirect('/admin/home')

       }else{
        req.flash('wrongkey',"Incorrect Verification KEY")
        return res.redirect(`/admin/forget_password`)
     }     
} catch (error) {
     res.status(500).send('Internal server Error')
    console.log('Error in admin keyvrification',error.message);
}
}

exports.getHome = (req, res) => {
    const state = 'dashboard'
    res.render('admin/pages/dashboard', { state })
}

exports.getProducts = async(req, res) => {
    try {
        const state = 'products'
        const page = parseInt(req.query.page) || 1

        const pageSize = 10
      
        const totalLength = await productModel.find()
        const pagCount = Math.floor( totalLength.length / pageSize + 1)
        
        const skip = (page - 1) * pageSize
        
        const products = await productModel.find().skip(skip).limit(pageSize)
                
        res.render('admin/pages/products', { state , products , page , pagCount })

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get products',error.message);
    }
}

exports.getAddproducts = async(req,res) =>{
    try {
        
        const categories = await categoryModel.find()
        res.render('admin/pages/addproducts',{state:'' , categories})

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get add products',error.message);
    }
  
}

exports.postAddproduct = async(req,res) => {
  try {  
    if(req.files.length > 10){
     return res.status(207).json({success:false,ERR:'Cannot exceed Image more than 5'})
    }
    const imagePath = req.files.map((file) => '/products-img/' + file.filename)

    const {
        productname,
        oldprice,
        newprice,
        category,
        size,
        stock,
        color,
        subcategory,
        deliverywithin,
        description,    
        returns,
    } = req.body

    const productExist = await productModel.findOne({productname})

    const newSchema = productModel({
        productname,
        oldprice,
        newprice,
        category,
        size,
        color,
        stock,
        productimg:imagePath,
        subcategory,
        deliverywithin,
        description,
        returns,
        review:[]
    })

    if(!productExist){

       const saveData = await newSchema.save()
       if(saveData){
         return res.status(200).json({success:true})
       }
       else{
         return res.status(206).json({success:false,ERR:'Product Added Failed'})
       }
    }
   else{
         return res.status(206).json({success:false,ERR:'Product Already Exist'})
   }
      
 
    
  } catch (error) {
     res.status(500).send('Internal server Error')
    console.log('Error in post add product',error.message);
  }
}

exports.getEditproduct = async(req,res) => {

    try {
        const id = req.params.id
        const product = await productModel.findOne({_id:id})

        const categories = await categoryModel.find()
        
        res.render('admin/pages/editproduct',{state:'',categories , id , product})

    } catch (error) {
         res.status(500).send('Internal server Error')

        console.log('Error in get edit product',error.message);
    }

}

exports.postEditproduct = async(req,res) => {

    try {
        const id = req.params.id
        const findProduct = await productModel.findOne({_id:id})

        const {productname , oldprice , newprice , category , subcategory , size , color , returns , stock , deliverywithin , description} = req.body
        
         const update = {
            productimg:'',
            productname,
            oldprice,
            newprice,
            category:category || findProduct.category,
            subcategory:subcategory || findProduct.subcategory,
            size,
            color,
            returns,
            stock,
            deliverywithin,
            description
        }
 
        if(req.files.length > 0){

            findProduct.productimg.forEach((img)=>{
                const imgpath = 'public/' + img
                fs.unlinkSync(imgpath)
             })

            const imagePath = req.files.map((file) => '/products-img/' + file.filename)
            update.productimg = imagePath
        }
        else{
            update.productimg = findProduct.productimg
        }
      
        await productModel.updateOne({_id:id},update)
        
        res.status(200).redirect('/admin/products')

    } catch (error) {
         res.status(500).send('Internal server Error')

        console.log('Error in post edit product',error.message);
    }
}

exports.deleteProduct = async(req,res) =>{

    try {
        const { id } = req.body

        const productDelete = await productModel.findByIdAndDelete(id)
  
        if(productDelete){
          
          productDelete.productimg.forEach((img)=>{
             const imgpath = 'public/' + img
             fs.unlinkSync(imgpath)
          })
          res.status(200).json({success:true})
  
        }
        else{ 
          return res.status(224).json({success:false})
        }

        
    } catch (error) {
        res.status(500).send('Internal server Error')
        console.log('Error in product delete',error.message)
    }
}

exports.getOpenproduct = async(req,res) => {

    try {
        const id = req.query.product
        const product = await productModel.findOne({_id:id})

        res.render('admin/pages/productopen',{state:'',product})
        
    } catch (error) {
        res.status(500).send('Internal server Error')
        console.log('Error in get open product',error.message);
    }
}

exports.getUsers = async(req, res) => {

    try {

        const state = 'users'
        const page = parseInt(req.query.page) || 1
        const pageSize = 7
      
        const skip = (page - 1) * pageSize
        
        const userList = await signupModel.aggregate([
            {
                $lookup:{
                from:'orders',
                localField:'_id',
                foreignField:'userId',
                as:'userOrders'
            }}

        ]).skip(skip).limit(pageSize)
        if(userList){

            res.status(200).render('admin/pages/users', { state , userList , page})
        }
        else{
            res.status(500).send('Bad Server')
        }

    } catch (error) {
        res.status(500).send('Internal server Error')
        console.log('Error in admin get users',error.message);
    }    
}

exports.getCustomer = async(req,res) =>{
    try {
        const id = req.params.id

        const user = await signupModel.findOne({_id:id})

        res.render('admin/pages/individualuser',{state:'',user})

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in customer indi get',error.message);
    }
}

exports.deleteUsers = async(req, res) => {
    try {
      const { id } = req.body
      const findUser = await signupModel.findById(id)
      if(findUser.blocked){
        await signupModel.updateOne({_id:id},{$set:{blocked:false}})
        unblockMsg(findUser)
        return res.status(200).json({success:true,blocked:false})
    }
    else{
        await signupModel.updateOne({_id:id},{$set:{blocked:true}})
        blockMessage(findUser)
        return res.status(200).json({success:true,blocked:true})
      }
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in admin delete users',error.message);
    }
}

exports.getCategory = async(req, res) => {
    try {
        
        const categories = await categoryModel.find()

        const state = 'category'
        res.render('admin/pages/category', { state ,categories })

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get category',error.message);
    }
}

exports.getAddcategory = (req,res) =>{
    const errMsg = req.flash('err')
    res.render('admin/pages/addcategory',{state:'',errMsg})
}

exports.postAddcategory = async(req,res) =>{
    try {

        const {categoryname , subcategory , catimageUrl} = req.body

        const catExist = await categoryModel.findOne({categoryname:req.body.categoryname})
       
        if(!categoryname || !subcategory){
            return res.status(244).json({success:false})

        }
    
        const newSchema = new categoryModel({
            categoryname:req.body.categoryname,
            catimageUrl,
            subcategory
        })

        if(!catExist){
            await newSchema.save()
            res.status(200).json({success:true})
        }
        else{

            for (const sub of subcategory) {
                 await categoryModel.updateOne(
                    { categoryname: categoryname },
                    { $push: { subcategory: sub } }
                    );
                }
                
             res.status(200).json({success:true})
        }


    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post add category',error.message);
    }
}        

exports.getEditcategory = async(req,res) => {
    try {
        
    const id = req.params.id
    const category = await categoryModel.findById(id)
    res.render('admin/pages/editcategory',{state:'' ,id , category})

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get edit category',error.message);
    }
    
}

exports.postEditcategory = async(req,res) => {
    try {

        const id = req.params.id

        const {categoryname , subcategory , catimageUrl} = req.body

        const findCat = await categoryModel.findById(id)

        const newSchema = await categoryModel.updateOne(
            {_id:id},
            {
            categoryname:categoryname || findCat.categoryname,
            catimageUrl:catimageUrl || findCat.categoryname,
            subcategory:findCat.subcategory
           })

        if(newSchema){
        for (const sub of subcategory) {
            await categoryModel.updateOne(
               { categoryname: categoryname },
               { $push: { subcategory: sub } }
               );
           }

         res.status(200).json({success:true})
        }
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post edit category',error.message);
    }
}

exports.deletCategory = async(req,res) =>{

    try {

        const {id} = req.body 
        const findCatAndDelete =  await categoryModel.deleteOne({_id:id})

        if(findCatAndDelete){
            res.status(200).json({success:true})
        }
        else{
            res.status(256).json({success:false})
        }
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in delete category',error.message);
    }

}   

exports.deleteSubcat = async(req,res) => {
   try {
    
    const id = req.params.id
    const subcatId = req.params.index

    const update = await categoryModel.updateOne(
        {_id:id},

        {$pull:{subcategory : {_id:subcatId}}
        })

    if(update.modifiedCount > 0 ){
        return res.status(200).json({success:true})
    }
    else{
        return res.status(500).json({success:false})
    }

   } catch (error) {
     res.status(500).send('Internal server Error')      
      console.log('Error in delete sub cat',error);
   }
}

exports.getBanners = async(req, res) => {

    try {

        const state = 'banners'
        const page = parseInt(req.query.page) || 1

        const pageSize = 7
      
        const totalLength = await bannerModel.find()
        const pagCount = Math.floor( totalLength.length / pageSize + 1)

        const skip = (page - 1) * pageSize
        
        const bannersList = await bannerModel.find().skip(skip).limit(pageSize)
        
        res.render('admin/pages/banners', { state , bannersList , page , pagCount})

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get Banners',error.message);
    }

}

exports.getAddbanner = (req,res) =>{
    res.render('admin/pages/addbanner',{state:''})
}

exports.postAddbanner = async(req,res) =>{

    try {
        const {bannername , bannerhead , banneramount , startdate , enddate } = req.body  

        if(!req.file){
            return res.status(402).json({err:"Please Provide a Image"})
        }

        const imagePath = '/banner-image/' + req.file.filename

        const newSchema = new bannerModel({
            bannerimg:imagePath,
            bannername,
            bannerhead,
            banneramount,
            startdate,
            enddate
        })
        
        await newSchema.save()
        res.status(200).json({success:true})

    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post add banner',error.message);
    }
    
}

exports.deleteBanner = async(req,res) => {

    try {

      const { id } = req.body

      const bannerDelete = await bannerModel.findByIdAndDelete(id)

      if(bannerDelete){
        const imagePath = 'public/' +  bannerDelete.bannerimg
        fs.unlinkSync(imagePath)
        res.status(200).json({success:true})

      }
      else{
        return res.status(224).json({success:false})
      }
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in delete banner',error.message);
    }
    
}  

exports.getEditbanner = async(req,res) => {

    try {
        const id = req.params.id
    
        const Banner = await bannerModel.findOne({_id:id})

        res.render('admin/pages/editbanner',{state:'',id,Banner})
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get edit banner');
    }
}



exports.postEditbanner = async(req,res) => {

    try {
        const{ bannername , bannerhead , banneramount , startdate , enddate }  = req.body     
        const id = req.params.id

        if(req.file){
            var imagePath = '/banner-image/' + req.file.filename 
        }

        await bannerModel.updateOne({_id:id},
        {
            bannerimg:imagePath,
            bannername,
            bannerhead,
            banneramount,
            startdate,
            enddate
        })

        res.status(200).redirect('/admin/banners')
        
    } catch (error) {
         res.status(500).send('Internal server Error')

        console.log('Error in post edit banner',error.message);
    }

}

exports.getCoupons = async(req, res) => {

    try {                
        const state = 'coupons'
        const page = parseInt(req.query.page) || 1

        const pageSize = 7
    
        const totalLength = await couponModel.find()
        const pagCount = Math.floor( totalLength.length / pageSize + 1)
        

        const skip = (page - 1) * pageSize
        
        const coupons = await couponModel.find().skip(skip).limit(pageSize)


        res.render('admin/pages/coupons', { state , coupons , page , pagCount})
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in get coupons',error.message);
    }
 
}

exports.getAddcoupons = (req,res) =>{
    res.render('admin/pages/addcoupons',{state:''})
}

exports.postAddcoupons = async(req,res) => {
    try {

        const {couponnname} = req.body

        const couponExist = await couponModel.findOne({couponnname})

        if(couponExist){

          return res.status(240).json({success:false})
        }
        else{
            await couponModel.create(req.body)
            res.status(200).json({success:true})
        }

        
    } catch (error) {
        res.status(500).send('Internal server Error')
        console.log('Error in post add coupons',error.message);
    }
}

exports.getEditcoupons = async(req,res) => {
    try {

        const id = req.params.id
    
        const coupon = await couponModel.findOne({_id:id})

        res.render('admin/pages/editcoupons',{state:'' , id , coupon})

        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post edit coupons',error.message);
    }
}

exports.postEditcoupons = async(req,res) => {
    try {

        const id  = req.params.id

        const updateCoupon = await couponModel.updateOne({_id:id},req.body)

        if(updateCoupon){
            console.log('Coupon edit Succes');
            res.status(200).redirect('/admin/coupons')
        }
        else{
            console.log('Coupon edit Failed');
            res.status(400).redirect(`/admin/coupons/edit_coupon/${id}`)
        }

        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post edit coupons',error.message);
    }
}

exports.deleteCoupon = async(req,res) => {
    try {
        const { id } = req.body

        const couponDelete = await couponModel.deleteOne({_id:id})
  
        if(couponDelete){
          res.status(200).json({success:true})
  
        }
        else{
          return res.status(224).json({success:false})
        }

        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in post edit coupons',error.message);
    }
}

exports.getMessages = async(req, res) => {
    try {

        const messages = await messageModel.find()
        
        const state = 'messages'
        res.render('admin/pages/messages', { state , messages})
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in user messages',error.messsage);
    }
}

exports.getUsermessage = async(req,res) =>{

    try {

        const id = req.params.id
        const message = await messageModel.findOne({_id:id})

        res.render('admin/pages/usermessage',{state:'' , message})
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in user message open',error.message);
    }
}

exports.getOrders = async(req,res) => {
    try {
        let orders=[];

        const state = 'orders' 
        const status = req.query.status


        if(status=='all'){
            orders = await orderModel.aggregate([
                { $unwind: "$products" },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: { $toObjectId: "$products.productId" } }, 
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$_id",
                                            "$$productId"
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "product"
                    }
                }
            ])
        }
        else{
       
            orders = await orderModel.aggregate([
                { $unwind: "$products" },
                {
                    $match: {
                        'products.status': status
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: { $toObjectId: "$products.productId" } }, 
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$_id",
                                            "$$productId"
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "product"
                    }
                }
            ])
        }     

        res.render('admin/pages/orders', { state , orders})
    
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in admin get orders',error);
    }

}   

exports.getOrderstatus = async(req,res) => {
    try {

        const orderId = req.query.orderId
        const productId = req.query.productId
        const userId = req.query.userId
        const status = req.body.status
        const findUser = await signupModel.findOne({_id:userId})
        

       const updateStatus = await orderModel.updateOne(
            {_id:orderId ,'products._id':productId},
            { $set: { "products.$.status": status } }
        )

        if(status=='shipped'){
            sippedMsg(findUser)
        }
        else if(status=='delivered'){
            deliveredMsg(findUser)
        }

        res.status(200).json({success:true})
        
    } catch (error) {
         res.status(500).send('Internal server Error')
        console.log('Error in admin get orders');
    }
       
}    

exports.getLogout = (req,res) => {
    try {

         req.session.destroy()
         res.redirect('/admin/login')
         
    } catch (error) {
         res.status(500).send('Internal server Error')
         console.log('Error in logout',error);
    }
}


