// USER AUTH SESSION

const sessionAuth = (req, res, next) => {

    if (req.session.loggedin) {
       next()
    }
    else{
        res.redirect('/login')
    }

}

module.exports = sessionAuth