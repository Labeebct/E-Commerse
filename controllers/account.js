const bcrypt = require('bcrypt')

const signupModel = require('../models/signup')
const messageModel = require('../models/message')






// <<<< ================================ UPDATE PASSWORD ================================ >>>>




exports.getUpdatepassword = (req,res) => {
    const state = 'updatepassword'
    res.render('user/pages/updatepassword',{state})
}


exports.postUpdatepassword = async(req,res) => {
    try {          

        const {oldpassword , newpassword} = req.body

        const email = req.session.email
        const user = await signupModel.findOne({email})
       
        const oldpassCheck = await bcrypt.compare(oldpassword,user.password)

        if(!oldpassCheck){
            return res.status(402).json({err:'Incorrect Old Password'})
        }
        else if(oldpassword === newpassword){
            return res.status(402).json({err:'Old password and new Password cannot be Same'})
        }
        else{
            const salt = await bcrypt.genSalt(10)
            const newPashedPass = await bcrypt.hash(newpassword , salt)

            await signupModel.updateOne({email},{$set:{password:newPashedPass}})

            console.log('Successfully updated password');

            res.status(200).json({success:true})
        }
        
    } catch (error) {
        console.log('Error in post update password',error.message);
    }
}




// <<<< ======================================= CONTACT US ================================== >>>>




exports.getContactus = (req,res) => {
    const state = 'contactus'
    res.render('user/pages/contactus',{state})
}


exports.postContactus = async(req,res) => {

    try {

       await messageModel.create(req.body)

       res.status(200).json({success:true})

        
    } catch (error) {
        console.log('Error in post contact us',error.message);
    }

}








exports.getAdress = (req,res) => {
    const state = 'address'
    res.render('user/pages/address',{state})
}

exports.getEditaddress = (req,res) => {
    res.render('user/pages/editaddress',{state:''})
}

exports.getAboutus = (req,res) => {
    const state = 'aboutus'
    res.render('user/pages/aboutus',{state})
}



exports.getOrder = (req,res) => {
    const state = 'orders'
    res.render('user/pages/orders',{state})
}

