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

exports.getContactus = (req,res) => {
    const state = 'contactus'
    res.render('user/pages/contactus',{state})
}


exports.getOrder = (req,res) => {
    const state = 'orders'
    res.render('user/pages/orders',{state})
}

exports.getUpdatepassword = (req,res) => {
    const state = 'updatepassword'
    res.render('user/pages/updatepassword',{state})
}
