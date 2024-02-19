const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const { ObjectId } = require('mongodb');
const { Types } = require('mongoose')



exports.getCart = async(req,res) => {
   
    try {  

        const state = 'cart'
        const userId = req.session.userId

        //Finding the user cart and wishlist

        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
       

        if(req.session.loggedin){ // Checking whether user logged in or not

            if(cartExist){

                const productIds = cartExist.products.map((product)=> product.productId) //looping cart database to get product id from cart products array

                const cartProducts = await productModel.find({_id:{$in:productIds}})  // finding product from product database that matching cart product product id


               const cartPrice =  await productModel.aggregate([  //Grouping all produtc price in user cart
                {$match:{_id:{$in:productIds}}},
                {$group:{_id:null,cartPrice:{$sum:"$newprice"}}}
              ]) 

        
              const cartTotal = productIds.length > 0 ?  cartPrice[0].cartPrice : 0  // finding the cart total to sho in user cart

              const cartQuantity = cartExist ? cartExist.products : []

              const cartCount = cartExist.products.length
              const discount = Math.round(cartTotal / 10) //calculating discount for product in cart
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

        const quantity = parseInt(cartQuantity)  // collectiing quantity while product open and add to cart
        const userId = req.session.userId


        const userObjId = new Types.ObjectId(userId)
        const productObjId = new Types.ObjectId(productId)

        const cartExist = await cartModel.findOne({userId})

        if(req.session.loggedin){ 
        if(!cartExist){ // if cart is not exist for the users
           const newSchema = new cartModel({
            userId:userObjId,
            products:[{productId:productObjId,quantity}]  // adding quantity and product id in  cart products
           })
          await newSchema.save() // saving data
          return res.status(200).json({success:true,cartcreated:true})
        }
        else{
           const productExist = cartExist.products.find((products)=> products.productId == productId) // checking whther product already exist in cart
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

        const { productId } = req.body // Destructuring product id from req.body which is passed by usng fetch
        const userId = req.session.userId

        const findProduct = await productModel.findById(productId)
        const deleteProductPrice = findProduct.newprice


        const removeProduct = await cartModel.updateOne({userId}, // removing the product from database using mongodb pull methode
          {$pull:{products:{productId}}
        })



       if(removeProduct.modifiedCount > 0){
        return res.status(200).json({success:true,productId,deleteProductPrice})
       }
        
    } catch (error) {
        console.log('Error in remove from cart',error.message);
    }
}


exports.getIncreaseQuantity = async(req,res) =>{
    try {
        
        const userId = req.session.userId

        const quantity = req.query.quantity
        const productIdin = req.query.productId

        const userObjId = new Types.ObjectId(userId)
        const productIdObj = new Types.ObjectId(productIdin)

        await cartModel.updateOne(
            { userId:userObjId, "products.productId": productIdObj },
            { "products.$.quantity": quantity } 
        );

    } catch (error) {
        console.log('Error in increase cart quantity',error);
    }
}