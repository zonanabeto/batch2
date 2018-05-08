// passport config

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

  
  //serializer
  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  //strategy(local)
  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ email:username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));

  //google strategy

  passport.use(new GoogleStrategy({
    clientID: "897798642180-3at2l11rv9okso0gfjhdoopptbrjm005.apps.googleusercontent.com",
    clientSecret: "XTVI_5LSa20PFkDKTayn2nzC",
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
        username:profile.displayName,
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

  module.exports = passport;