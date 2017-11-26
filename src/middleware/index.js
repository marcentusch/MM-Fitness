// All middleware goes into this object
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_messages', 'Du skal være logget ind for at gøre det.');
    res.redirect('/login');
}

module.exports = middlewareObj;