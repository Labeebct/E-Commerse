exports.getAdress = (req,res) => {
    const state = 'account'
    res.render('user/pages/address',{state})
}