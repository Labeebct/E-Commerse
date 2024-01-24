exports.getSignup = (req,res) => {
     res.render('user/pages/signup')
}

exports.getLogin = (req,res) => {
     res.render('common/login')
}

exports.getCart = (req,res) => {
     const state = 'cart'
     res.render('user/pages/cart',{state})
}

exports.getHome = (req,res) => {
     const state = 'home'
     res.render('user/pages/home',{state})
}

exports.getWishlist = (req,res) => {
     const state = 'wishlist'
     res.render('user/pages/wishlist',{state})
}
