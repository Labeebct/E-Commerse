const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const { ObjectId } = require('mongodb');

const { Types } = require('mongoose')



exports.getCart = async(req,res) => {
   
    try {  

        const state = 'cart'
        const userId = req.session.userId

        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
       

        if(req.session.loggedin){

            if(cartExist){

                const productIds = cartExist.products.map((product)=> product.productId)

                const cartProducts = await productModel.find({_id:{$in:productIds}})


               const cartPrice =  await productModel.aggregate([
                {$match:{_id:{$in:productIds}}},
                {$group:{_id:null,cartPrice:{$sum:"$newprice"}}}
              ]) 

              const cartTotal = productIds.length > 0 ?  cartPrice[0].cartPrice : 0

              const cartQuantity = cartExist ? cartExist.products : []

              const cartCount = cartExist.products.length
              const discount = Math.round(cartTotal / 100)
              const gst = cartTotal / 1000

              
              return res.render('user/pages/cart',{state , loggedIn:true , cartExist , cartQuantity , cartCount , cartProducts , cartTotal , discount ,gst ,ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
            }
            else{
              return res.render('user/pages/cart',{state , loggedIn:true , cartExist:false, cartQuantity:'' , cartCount:0 ,cartProducts:'' , cartTotal:'' , discount:'' , gst:'' , ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
            }
        }
        else{
            return res.render('user/pages/cart',{state , loggedIn:false , cartExist:false , cartQuantity:'' , cartCount:0 , cartProducts:'' , cartTotal:'',discount:'',gst:'' , ObjectId,cartCount: cartExist? cartExist.products.length : 0,wishCount: wishExist? wishExist.products.length : 0})
        }

    } catch (error) {

        console.log('Error in get cart',error);
    }

} 
   
   

exports.postAddCart = async(req,res) => {

    try {

        const { productId , cartQuantity } = req.body
        const quantity = parseInt(cartQuantity)
        const userId = req.session.userId

        console.log(quantity);

        const userObjId = new Types.ObjectId(userId)
        const productObjId = new Types.ObjectId(productId)

        const cartExist = await cartModel.findOne({userId})

        if(req.session.loggedin){
        if(!cartExist){
           const newSchema = new cartModel({
            userId:userObjId,
            products:[{productId:productObjId,quantity}]
           })
          await newSchema.save()
          return res.status(200).json({success:true,cartcreated:true})
        }
        else{
           const productExist = cartExist.products.find((products)=> products.productId == productId)
           if(!productExist){
            await cartModel.updateOne({userId},
                {$push:{products:{productId:productObjId,quantity}}}
                )
            console.log('Product succesfully added to cart'); 
            return res.status(245).json({success:true,cartcreated:true})
        }
        else{
            console.log('Product already exist in cart');
            return res.status(200).json({success:true,cartcreated:true})

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



exports.postRemoveCart = async(req,res) => {
    try {

        const { productId } = req.body
        const userId = req.session.userId

        const removeProduct = await cartModel.updateOne({userId},
          {$pull:{products:{productId}}
        })

       if(removeProduct.modifiedCount > 0){
        return res.status(200).json({success:true,productId})
       }
        
    } catch (error) {
        console.log('Error in remove from cart',error.message);
    }
}