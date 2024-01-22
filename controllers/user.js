exports.getSignup = (req,res) => {
     res.render('user/pages/signup.ejs')
}

exports.getLogin = (req,res) => {
     res.render('common/login.ejs')
}