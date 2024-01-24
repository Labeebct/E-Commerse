
exports.getSignup = (req, res) => {
    res.render('admin/pages/signup')
}


exports.getHome = (req, res) => {
    const state = 'dashboard'
    res.render('admin/pages/dashboard', { state })
}


exports.getUsers = (req, res) => {
    const state = 'users'
    res.render('admin/pages/users', { state })
}


exports.getProducts = (req, res) => {
    const state = 'products'
    res.render('admin/pages/products', { state })
}


exports.getCategory = (req, res) => {
    const state = 'category'
    res.render('admin/pages/category', { state })
}


exports.getMessages = (req, res) => {
    const state = 'messages'
    res.render('admin/pages/messages', { state })
}


exports.getCoupons = (req, res) => {
    const state = 'coupons'
    res.render('admin/pages/coupons', { state })
}


exports.getBanners = (req, res) => {
    const state = 'banners'
    res.render('admin/pages/banners', { state })
}


exports.getAddproducts = (req,res) =>{
    res.render('admin/pages/addproducts',{state:''})
}

exports.getAddcatogery = (req,res) =>{
    res.render('admin/pages/addcategory',{state:''})
}


exports.getAddbanner = (req,res) =>{
    res.render('admin/pages/addbanner',{state:''})
}


exports.getAddcoupons = (req,res) =>{
    res.render('admin/pages/addcoupons',{state:''})
}


exports.getUsermessage = (req,res) =>{
    res.render('admin/pages/usermessage',{state:''})
}

