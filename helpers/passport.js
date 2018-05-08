// passport config

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


  
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



  //google strategy

  passport.use(new GoogleStrategy({
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }
      console.log(profile);

      const newUser = new User({
        googleID: profile.id,
        name:profile.name.givenName,
        lastname:profile.name.familyName,
        email:profile.emails[0].value
      });
  
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });
  
  }));


  //linked in Strategy

  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
  }, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      User.findOne({ linkedinID: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        console.log(profile);
  
        const newUser = new User({
          linkedinID: profile.id,
          name:profile.firstName,
          lastname:profile.lastName,
          email:profile.emailAddress
        });
    
        newUser.save((err) => {
          if (err) {
            return done(err);
          }
          done(null, newUser);
        });
      });
    });
  }));






  module.exports = passport;