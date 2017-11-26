// All middleware goes into this object
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Du er ikke logget ind.");
    res.redirect('/login');
}

module.exports = middlewareObj;