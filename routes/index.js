const express = require('express');
const router  = express.Router();

/* GET home page */

function isAuthenticated(req,res, next){
  if(req.isAuthenticated()){
      return res.redirect('/profile')
  }
  return next();
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}

function isNotAuth(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  return res.redirect('/');
}





router.get('/', isAuthenticated, (req, res, next) => {

  res.render('index');

});

router.get("/profile", isLoggedIn,(req,res,next)=>{

res.render("help")

});



router.post("/help", isAuthenticated , (req,res,next)=>{
console.log(req.body)

})

module.exports = router;
