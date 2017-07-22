const passport = require('passport')
const FbStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

function config () {
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  const fbOptions = {
    clientID: '102312127053047',
    clientSecret: '0b99bca664ff589bba2217a0208331f4',
    callbackURL: '/auth/facebook/callback'
  }
  passport.use('facebook', new FbStrategy(fbOptions, fbAuth))
  return passport
}

function serializeUser (user, callback) {
  return callback(null, user.id)
}

function deserializeUser (id, callback) {
  return User.findById(id, (error, user) => {
    if (error) return callback(error)
    callback(null, user)
  })
}

function fbAuth (accessToken, refreshToken, profile, done) {
  User.findOne({
    facebookID: profile.id
  }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      return done(null, user)
    }
    const newUser = new User({
      facebookID: profile.id,
      username: profile.displayName,
      name: profile.name.givenName || null,
      familyName: profile.name.familyName || null,
      email: profile.name.email || null
    })

    newUser.save((err) => {
      if (err) {
        return done(err)
      }
      done(null, newUser)
    })
  })
}

module.exports = config
