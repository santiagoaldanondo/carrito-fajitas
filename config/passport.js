const passport = require("passport");
const FbStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");
require("dotenv").config();

function config() {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  const fbOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  };
  passport.use("facebook", new FbStrategy(fbOptions, fbAuth));
  return passport;
}

function serializeUser(user, callback) {
  return callback(null, user.id);
}

function deserializeUser(id, callback) {
  return User.findById(id, (error, user) => {
    if (error) return callback(error);
    callback(null, user);
  });
}

function fbAuth(accessToken, refreshToken, profile, done) {
  User.findOne({
    facebookID: profile.id
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }
    const newUser = new User({
      username: profile.displayName,
      facebookID: profile.id,
      categories: [],
      _recipes: [],
      _events: [],
      address: "",
      location: {
        "coordinates": [45.36201191934904, 2.9394516348838806],
        "type": "Point"
      }
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });
}

module.exports = config;