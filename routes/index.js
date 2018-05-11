const express = require('express');
const router  = express.Router();
const Help = require("../models/Help")
const nodemailer = require("nodemailer");
const User = require("../models/User");

let tp = nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user: process.env.USER_MAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})


function isAuthenticated(req,res, next){
  if(req.isAuthenticated()){
      return res.redirect('/dashboard')
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

router.get("/dashboard", isLoggedIn,(req,res,next)=>{
  req.app.locals.user;
res.render("dashboard")
});



router.post("/help", isLoggedIn , (req,res,next)=>{
req.body.user = req.user;
Help.create(req.body)
.then(r=>{
  return User.find({role:req.body.area})
})
.then(users=>{
  users.forEach((a)=>{
    let message = {
        from: "help@batch2.com" ,
        to: a.email ,
        subject: "New request from user " + req.body.user._id,
        text: req.body.description
      }
      tp.sendMail(message)
    })
})
.then(email=>{
    let message = {
        from: "help@batch2.com" ,
        to: req.body.user.email ,
        subject: "We received your request " + req.body.user.name + " "+req.body.user.lastName,
        text: "We sent your request to our "+req.body.area+" team. We are working on your your request. "
      }
      tp.sendMail(message)
})
.then(r=>{
    res.render("profile")
})
.catch(e=>next(e))
})



module.exports = router;
