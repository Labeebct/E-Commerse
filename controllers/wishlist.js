const productModel = require('../models/products')
const wishlistModel = require('../models/wishlist')
const cartModel = require('../models/cart')


const { Types } = require('mongoose')

    


exports.getWishlist = async(req,res) => {
    
    try {  
        
        const state = 'wishlist'

        const userId = req.session.userId

        const wishExist = await wishlistModel.findOne({userId})
        const cartExist = await cartModel.findOne({userId})


        if(req.session.loggedin){ // Checking whether user wishlist or not

            if(wishExist){

              const productIds = wishExist.products.map((product)=> product.productId)

              const wishProducts = await productModel.find({_id:{$in:productIds}}) // Finding products that matches the  product id in wishlist  database

              
              return res.render('user/pages/wishlist',{state , loggedIn:true , wishExist , wishProducts ,wishCount: wishExist? wishExist.products.length : 0,cartCount: cartExist? cartExist.products.length : 0})
            }
            else{
              return res.render('user/pages/wishlist',{state , loggedIn:true , wishExist:false ,wishProducts:'' , wishCount:0,cartCount: cartExist? cartExist.products.length : 0})
            }
        }
        else{
             return res.render('user/pages/wishlist',{state , loggedIn:false , wishExist:false ,wishProducts:'' , wishCount:'',cartCount: cartExist? cartExist.products.length : 0})
        }
 
    } catch (error) {

        console.log('Error in get wislist',error);
    }
}


exports.postAddwishlist = async(req,res) => {
    try {

        const { productId } = req.body
        const userId = req.session.userId

        const userObjId = new Types.ObjectId(userId)
        const productObjId = new Types.ObjectId(productId)

        const wishExist = await wishlistModel.findOne({userId})

        if(req.session.loggedin){
        if(!wishExist){  // If wishlist is not exist for users
           const newSchema = new wishlistModel({
            userId:userObjId,
            products:[{productId:productObjId}]
           })
          await newSchema.save()
          console.log('Wishlist succesfully created');
          return res.status(200).json({wishlistcreated:true})
        }
        else{
           const productExist = wishExist.products.find((products)=> products.productId == productId) 
           if(!productExist){ // Checking whether product already exist in wishlist
            await wishlistModel.updateOne({userId},
                {$push:{products:{productId:productObjId}}}
                )
            console.log('Product succesfully added to wishlist'); 
        }
        else{
            console.log('Product already exist in wishlist');
            return res.status(289)
           }
        }
    }else{
        console.log('Not logged in');
        res.status(423).json({notloggedin:true})
    }
    

        
    } catch (error) {
        console.log('Error in add to wishlist',error.message);
    }
}




exports.postFromwishToCart = async(req,res) => {

    try {

        console.log('hii');

        const { productId } = req.body
        const userId = req.session.userId

        const userObjId = new Types.ObjectId(userId)
        const productObjId = new Types.ObjectId(productId)

        const cartExist = await cartModel.findOne({userId})

        if(req.session.loggedin){
        if(!cartExist){ //checking whether cart exist for users
           const newSchema = new cartModel({
            userId:userObjId,
            products:[{productId:productObjId,quantity:1}]
           })
          await newSchema.save()

          await wishlistModel.updateOne({userId},
            {$pull:{products:{productId}}
          })

          return res.status(200).json({success:true,cartcreated:true})
        }
        else{
           const productExist = cartExist.products.find((products)=> products.productId == productId)
           if(!productExist){

            await cartModel.updateOne({userId},
                {$push:{products:{productId:productObjId,quantity:1}}}
                )

            await wishlistModel.updateOne({userId},  // pulling out the product from array
                {$pull:{products:{productId}}
                })
                
            console.log('Product succesfully added to cart');
            return res.status(270).json({success:true})
        }
        else{
            console.log('Product already exist in cart');
            return res.status(200).json({success:true})
           }
        }
    }else{
        console.log('Not logged in');
        res.status(423).json({notloggedin:true})
    }
    
        
    }catch(error){
        console.log('Error in add to cart post',error.message);
    }
}




exports.deleteWishlist = async(req,res) => {
    try {

        const { productId } = req.body
        const userId = req.session.userId

        const removeProduct = await wishlistModel.updateOne({userId},  //removing product from wishlist
          {$pull:{products:{productId}}
        })

       if(removeProduct.modifiedCount > 0){
        return res.status(200).json({success:true,productId}) //passing succes message if  deletion success
       }
        
    } catch (error) {
        console.log('Error in delete in wishlist',error.message);
    }
}
       