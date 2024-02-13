const productModel = require('../models/products')
const categoryModel = require('../models/category')
const wishlistModel = require('../models/wishlist')
const cartModel = require('../models/cart')
const bannerModel = require('../models/banner')
const couponModel = require('../models/coupon')

const { ObjectId } = require('mongodb');


// <<<<< ============================================== HOME ========================================================= >>>>>






exports.getHome = async(req,res) => {

     try {
        

          const state = 'home'
          const categories = await categoryModel.find()

          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})
          const cartExist = await cartModel.findOne({userId})

          const banners = await bannerModel.find()


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
          cartCount: cartExist? cartExist.products.length : 0,
          wishCount: wishExist? wishExist.products.length : 0,
          utensils,
          wishExist:wishExist ? wishExist.products : [],
          cartExist:cartExist ? cartExist.products : [],
          ObjectId,
          banners
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
          const cartExist = await cartModel.findOne({userId})


          const catProducts = await productModel.aggregate([
               { $match: {category:category} }
          ])          

          res.render('user/pages/categoryproducts',{state:category, catProducts , categories, wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          
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
          const cartExist = await cartModel.findOne({userId})


          console.log(subcat);


          const subcatProducts = await productModel.aggregate([
               { $match: {subcategory:subcat} }
          ])          

          res.render('user/pages/subcatproducts',{state:subcat, subcatProducts , categories ,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          
     } catch (error) {
          console.log('Error in get category',error);
     }
}





exports.getProductopen = async(req,res) => {
     try {
          const productId = req.query.product

          const userId = req.session.userId

          const wishExist = await wishlistModel.findOne({userId})
          const cartExist = await cartModel.findOne({userId}) 

          const product = await productModel.findOne({_id:productId})

          const relatedProducts = await productModel.aggregate([
               {$match:{subcategory:product.subcategory}}
          ]) 

          res.render('user/pages/productopen',{state:'', product , relatedProducts ,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          
     }catch (error) {
          console.log('Error in get product open',error.message);
     }
}





exports.getAllproducts = async(req,res) => {
     try {

          const userId = req.session.userId

            
          const wishExist = await wishlistModel.findOne({userId})
          const cartExist = await cartModel.findOne({userId}) 
        
          res.render('user/pages/allproducts',{state:'',cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          
     }catch (error) {
          console.log('Error in get product open',error.message);
     }
}




exports.getShowAllproducts = async(req,res) => {
     try {

          const userId = req.session.userId

          const page = parseInt(req.query.page) || 1
          const filterBase = req.query.f
          const filterValue = req.query.filter

          const search = req.query.search

          const pageSize = 40
          const skip = (page - 1) * pageSize
          
          const wishExist = await wishlistModel.findOne({userId})
          const cartExist = await cartModel.findOne({userId}) 
        
          if(search){
             const searchFilter = await productModel.find({productname: { $regex:search, $options: 'i' } })
             return res.status(200).json({searchFilter,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          }
          else if(filterBase && filterValue){

               if(filterBase === 'CATEGORY'){
                    const filterProducts = await productModel.aggregate([
                         {$match:{category:filterValue}}
                    ])
                   return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
               }
               else if(filterBase === 'PRICE'){


                    if(filterValue === '500'){
                         const filterProducts = await productModel.aggregate([
                              {$match:{newprice:{$lt:500}}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
                    }
                    else if(filterValue === '1000'){
                         const filterProducts = await productModel.aggregate([
                              {$match:{newprice:{$gte:500 , $lt:1000}}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})

                    }
                    else if(filterValue === '1500'){
                         const filterProducts = await productModel.aggregate([
                              {$match:{newprice:{$gte:1000 , $lt:1500}}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})

                    }
                    else if(filterValue === '2500'){
                         const filterProducts = await productModel.aggregate([
                              {$match:{newprice:{$gte:1500 , $lt:2500}}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
                    }
                    else if(filterValue === 'low to high'){
                         const filterProducts = await productModel.aggregate([
                              {$sort:{newprice:1}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
                    }
                    else if(filterValue === 'high to low'){
                         const filterProducts = await productModel.aggregate([
                              {$sort:{newprice:-1}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
                    }
                    else{
                         const filterProducts = await productModel.aggregate([
                              {$match:{newprice:{$gt:2500}}}
                         ])
                         return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
                    }
               }
               else{
               const allProducts = await productModel.find()
               const filterProducts = [];

               allProducts.forEach((product) => {
                    const filterProduct = product.color.filter((color) => color === filterValue);
                    if (filterProduct.length > 0) {
                        filterProducts.push(product);
                    }
                });
               return res.status(200).json({filterProducts,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
               }

          }else{
               const products = await productModel.find().skip(skip).limit(pageSize)

               res.status(200).json({products,wishExist:wishExist ? wishExist.products : [], ObjectId , cartExist:cartExist ? cartExist.products : [],cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
          }

          
     }catch (error) {
          console.log('Error in get product open',error.message);
     }
}







