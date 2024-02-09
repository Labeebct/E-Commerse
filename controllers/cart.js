const cartModel = require('../models/cart')
const { Types } = require('mongoose')



exports.getCart = async(req,res) => {

    try {

        const state = 'cart'
        const userId = req.session.userId

        const cartExist = await cartModel.findOne({userId})

        if(req.session.loggedin){
            if(cartExist){
              return res.render('user/pages/cart',{state , cartExist})
            }
            else{
              return res.render('user/pages/cart',{state , cartExist:false})
            }
        }
        else{
            return res.render('user/pages/cart',{state , loggedIn:false})
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
