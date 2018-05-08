const router = require("express").Router();




function isAuthenticated(req,res, next){
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    return next();
}

function isNotAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}


module.exports = router;