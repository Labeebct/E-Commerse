
exports.getSignup = (req,res) => {
    res.render('admin/pages/signup')
}

exports.getHome = (req,res) => {
    const state = 'dashboard'
    res.render('admin/pages/dashboard',{state})
}