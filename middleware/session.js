const session = require('express-session')


// USER AUTH SESSION

const sessionAuth = (req, res, next) => {

    if (req.session.email) {
       next()
    }
    else{
        res.redirect('/login')
    }

}

module.exports = sessionAuth