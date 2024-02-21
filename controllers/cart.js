const productModel = require('../models/products')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const { ObjectId } = require('mongodb');
const { Types } = require('mongoose');
const products = require('../models/products');



exports.getCart = async(req,res) => {
   
    try {  

        const state = 'cart'
        const userId = req.session.userId

        //Finding the user cart and wishlist

        const cartExist = await cartModel.findOne({userId})
        const wishExist = await wishlistModel.findOne({userId})
       

        if(req.session.loggedin){ // Checking whether user logged in or not

            if(cartExist){

            const cart = await cartModel.find({userId}).populate('products.productId')

            const cartProducts = cart ? cart[0].products : []
            const cartQuantity = cartExist.products.length
            const cartCount = cartExist.products.length


            const cartTotal = cartProducts.reduce((acc,item)=>{
               return acc + (item.productId.newprice * item.quantity)
            },0)

            const discount = Math.round(cartTotal * .05) //calculating discount for product in cart
            const gst = cartTotal * .01

              
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

        const cart = await cartModel.find({userId}).populate('products.productId')

        const cartProducts = cart ? cart[0].products : []

        const findProduct = cartProducts.find((products) => products.productId._id == productId)

        if(!findProduct){
            return
        }

        const deleteProductPrice = findProduct.productId.newprice * findProduct.quantity

        const cartPrice = cartProducts.reduce((acc,item)=>{
            return acc + (item.productId.newprice * item.quantity)
         },0)-deleteProductPrice

        const removeProduct = await cartModel.updateOne({userId}, // removing the product from database using mongodb pull methode
          {$pull:{products:{productId}}
        })



       if(removeProduct.modifiedCount > 0){
        return res.status(200).json({success:true,productId,deleteProductPrice,cartPrice})
       }
        
    } catch (error) {
        console.log('Error in remove from cart',error.message);
    }
}


exports.getIncreaseQuantity = async(req,res) =>{
    try {
        
        let currentPrice;
        let cartPrice;
        let newPrice;

        const userId = req.session.userId

        const quantity = req.query.quantity
        const productIdin = req.query.productId

        const userObjId = new Types.ObjectId(userId)
        const productIdObj = new Types.ObjectId(productIdin)
            
        const cart = await cartModel.find({userId}).populate('products.productId')

        const cartProducts = cart ? cart[0].products : []
        
        const findProduct = cartProducts.find((products) => products.productId._id == productIdin)
        const findSingleProduct = await productModel.findOne({_id:productIdin})

        if(!findProduct){
            currentPrice = Number(findSingleProduct.newprice * 1)
            newPrice = Number(findSingleProduct.newprice * quantity)
            cartPrice = Number(findSingleProduct.newprice)
        }
        else{
   
        currentPrice = findProduct.productId.newprice * findProduct.quantity
        
        await cartModel.updateOne(
            { userId:userObjId, "products.productId": productIdObj },
            { "products.$.quantity": quantity } 
            );
            
        newPrice =  findProduct.productId.newprice * quantity
            
            cartPrice = cartProducts.reduce((acc,item)=>{
                return acc + (item.productId.newprice * item.quantity)
             },0)

        }

        res.status(200).json({success:true,currentPrice,newPrice,cartPrice})

    } catch (error) {
        console.log('Error in increase cart quantity',error);
    }
}