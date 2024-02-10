const signupModel = require('../models/signup')
const productModel = require('../models/products')
const categoryModel = require('../models/category')
const wishlistModel = require('../models/wishlist')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')
const messageModel = require('../models/message')

const { ObjectId } = require('mongodb');


// <<<<< ============================================== HOME ========================================================= >>>>>






exports.getHome = async(req,res) => {

     try {
        

          const state = 'home'
          const categories = await categoryModel.find()

          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})


          const mensShirts = await productModel.aggregate([
               {$match:{subcategory:'MENS SHIRTS'}}
          ])
          const mensTshirts = await productModel.aggregate([
               {$match:{subcategory:'MENS TSHIRT'}}
          ])
          const womensKurtas = await productModel.aggregate([
               {$match:{subcategory:'WOMENS KURTA'}}
          ])
          const womensSaree = await productModel.aggregate([
               {$match:{subcategory:'WOMENS SAREE'}}
          ])
          const mensShoes = await productModel.aggregate([
               {$match:{subcategory:'MENS SHOES'}}
          ])
          const womensFootwear = await productModel.aggregate([
               {$match:{subcategory:'WOMENS FOOTWEAR'}}
          ])
          
          const mensPant = await productModel.aggregate([
               {$match:{subcategory:'MENS PANTS'}}
          ])
          const womensTop = await productModel.aggregate([
               {$match:{subcategory:'WOMENS TOP'}}
          ])
          const kidsFrocks = await productModel.aggregate([
               {$match:{subcategory:'KIDS FROCK'}}
          ])
          const kidsToys = await productModel.aggregate([
               {$match:{subcategory:'KID TOYS'}}
          ])
      
          const babyWipes = await productModel.aggregate([
               {$match:{subcategory:'BABY WIPES'}}
          ])
      
          const mobiles = await productModel.aggregate([
               {$match:{subcategory:'MOBILES'}}
          ])
          const laptops = await productModel.aggregate([
               {$match:{subcategory:'LAPTOPS'}}
          ])
          const fridge = await productModel.aggregate([
               {$match:{subcategory:'FRIDGE'}}
          ])
          const headset = await productModel.aggregate([
               {$match:{subcategory:'HEADSET'}}
          ])
          const tv = await productModel.aggregate([
               {$match:{subcategory:'TV'}}
          ])

          const mensWatches = await productModel.aggregate([
               {$match:{subcategory:'MENS WATCHES'}}
          ])
          const painting = await productModel.aggregate([
               {$match:{subcategory:'PAINTINGS'}}
          ])
          const bedsheet = await productModel.aggregate([
               {$match:{subcategory:'BEDSHEET'}}
          ])
          const utensils = await productModel.aggregate([
               {$match:{subcategory:'UTENSILS'}}
          ])

          res.render('user/pages/home',
          {
          state,
          categories,
          mensShirts,
          mensShoes,
          mensWatches,
          womensTop,
          womensKurtas,
          womensFootwear,
          mensPant,
          kidsFrocks,
          kidsToys,
          babyWipes,
          mobiles,
          laptops,   
          fridge,
          headset,
          tv,
          mensTshirts,
          womensSaree,
          painting,
          bedsheet,
          utensils,
          wishExist:wishExist ? wishExist.products : [],
          ObjectId
          })
    

          
     } catch (error) {
          console.log('Error in user home get',error);
     }
}




exports.getCategory = async(req,res) => {
     try {        

          const category = req.params.cat
          const categories = await categoryModel.find()
          
          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})


          const catProducts = await productModel.aggregate([
               { $match: {category:category} }
          ])          

          res.render('user/pages/categoryproducts',{state:category, catProducts , categories, wishExist:wishExist ? wishExist.products : [], ObjectId})
          
     } catch (error) {
          console.log('Error in get category',error);
     }
}



exports.getSubcategory = async(req,res) => {
     try {        

          const subcat = req.params.subcat
          const categories = await categoryModel.find()

                    
          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})


          console.log(subcat);


          const subcatProducts = await productModel.aggregate([
               { $match: {subcategory:subcat} }
          ])          

          res.render('user/pages/subcatproducts',{state:subcat, subcatProducts , categories ,wishExist:wishExist ? wishExist.products : [], ObjectId })
          
     } catch (error) {
          console.log('Error in get category',error);
     }
}





exports.getProductopen = async(req,res) => {
     try {
          const productId = req.query.product

          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})
    
          const product = await productModel.findOne({_id:productId})

          const relatedProducts = await productModel.aggregate([
               {$match:{subcategory:product.subcategory}}
          ]) 

          res.render('user/pages/productopen',{state:'', product , relatedProducts ,wishExist:wishExist ? wishExist.products : [], ObjectId})
          
     }catch (error) {
          console.log('Error in get product open',error.message);
     }
}







