const session = require('express-session')

const sessionAuth = (req, res, next) => {

    if (req.session.email) {
       next()
    }
    else{
        res.redirect('/login')
    }

}

module.exports = sessionAuth