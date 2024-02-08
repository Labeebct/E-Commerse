exports.getCart = (req,res) => {
    const state = 'cart'
    res.render('user/pages/cart',{state})
}
