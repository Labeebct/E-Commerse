const productModel = require('../models/products')
const wishlistModel = require('../models/wishlist')

const { Types } = require('mongoose')

    


exports.getWishlist = async(req,res) => {
    
    try {  
        
        const state = 'wishlist'

        const userId = req.session.userId

        const wishExist = await wishlistModel.findOne({userId})


        if(req.session.loggedin){

            if(wishExist){

              const productIds = wishExist.products.map((product)=> product.productId)

              const wishProducts = await productModel.find({_id:{$in:productIds}})
              const wishCount = wishExist.products.length

              
              return res.render('user/pages/wishlist',{state , loggedIn:true , wishExist , wishProducts , wishCount})
            }
            else{
              return res.render('user/pages/wishlist',{state , loggedIn:true , wishExist:false ,wishProducts:'' , wishCount:0})
            }
        }
        else{
             return res.render('user/pages/wishlist',{state , loggedIn:false , wishExist:false ,wishProducts:'' , wishCount:''})
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
        if(!wishExist){
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
           if(!productExist){
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


exports.deleteWishlist = async(req,res) => {
    try {

        const { productId } = req.body
        const userId = req.session.userId

        const removeProduct = await wishlistModel.updateOne({userId},
          {$pull:{products:{productId}}
        })

       if(removeProduct.modifiedCount > 0){
        return res.status(200).json({success:true,productId})
       }
        
    } catch (error) {
        console.log('Error in delete in wishlist',error.message);
    }
}
       