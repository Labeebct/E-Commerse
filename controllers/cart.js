const productModel = require('../models/products')
const cartModel = require('../models/cart')
const { Types } = require('mongoose')



exports.getCart = async(req,res) => {
   
    try {  

        const state = 'cart'
        const userId = req.session.userId

        const cartExist = await cartModel.findOne({userId})


        if(req.session.loggedin){

            if(cartExist){

              const productIds = cartExist.products.map((product)=> product.productId)

              const cartProducts = await productModel.find({_id:{$in:productIds}})


               const cartPrice =  await productModel.aggregate([
                {$match:{_id:{$in:productIds}}},
                {$group:{_id:null,cartPrice:{$sum:"$newprice"}}}
              ]) 

              const cartTotal = productIds.length > 0 ?  cartPrice[0].cartPrice : 0

              const cartCount = cartExist.products.length 

              return res.render('user/pages/cart',{state , loggedIn:true , cartExist:true , cartCount , cartProducts , cartTotal})
            }
            else{
              return res.render('user/pages/cart',{state , loggedIn:true , cartExist:false , cartCount:0 ,cartProducts:'' , cartTotal:''})
            }
        }
        else{
            return res.render('user/pages/cart',{state , loggedIn:false , cartExist:false , cartCount:0 , cartProducts:'' , cartTotal:''})
        }

    } catch (error) {

        console.log('Error in get cart',error);
    }

} 
   
   

exports.postAddCart = async(req,res) => {

    try {

        const { productId } = req.body
        const userId = req.session.userId

        const userObjId = new Types.ObjectId(userId)
        const productObjId = new Types.ObjectId(productId)

        const cartExist = await cartModel.findOne({userId})

        if(req.session.loggedin){
        if(!cartExist){
           const newSchema = new cartModel({
            userId:userObjId,
            products:[{productId:productObjId,quantity:1}]
           })
          await newSchema.save()
          return res.status(200).json({cartcreated:true})
        }
        else{
           const productExist = cartExist.products.find((products)=> products.productId == productId)
           if(!productExist){
            await cartModel.updateOne({userId},
                {$push:{products:{productId:productObjId,quantity:1}}}
                )
            console.log('Product succesfully added to cart'); 
        }
        else{
            console.log('Product already exist in cart');
            return res.status(289)
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