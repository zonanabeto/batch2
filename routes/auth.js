const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User")


function isAuthenticated(req,res, next){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    return next();
}

function isNotAuth(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

function passwordVerif(req,res,next){
    if(req.body.password1!==req.body.password2){
        console.log(req.body.password1,req.body.password2)
        req.body.error = "Your passwords do not match.";
        res.render("index",req.body)
        return;
    }
    return next();
}


router.get('/logout', (req,res)=>{
    req.logout();
    delete req.app.locals.user;
    res.redirect('/');
})

router.post('/login', 
    passport.authenticate('local'), 
    (req,res)=>{
        req.app.locals.user = req.user;
        res.redirect('/dashboard');
    })

//local
router.post('/signup', passwordVerif,
    (req,res,next)=>{
        User.register(req.body, req.body.password1, function(err, user) {
            if (err) return res.send(err);
            console.log("ando acá")
            res.redirect('/dashboard')
            // passport.authenticate('local')((err, result) => {
            //     console.log("aqui ando");
            //     if (err) return res.send(err);
            //     return res.redirect('/profile');
            // });
    });
});


//google auth
router.get("/auth/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"]
  }));
  
  router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/dashboard"
  }));

//linked in auth
router.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

  router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }));









module.exports = router;