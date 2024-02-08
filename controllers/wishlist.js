exports.getWishlist = (req,res) => {
    const state = 'wishlist'
    res.render('user/pages/wishlist',{state})
}
