const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./userModel');
require('dotenv').config();

const localStrategy = new LocalStrategy(
  function (username, password, done) {
    User.authenticate(username, password, function (err, user, info) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, info);
      }
      return done(null, user);
    });
  }
);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // kod do wyszukiwania lub tworzenia użytkownika w bazie danych
    // W przypadku braku bazy danych, uproszczony sposób przekazania profilu użytkownika:
    return cb(null, profile);
  }
));

// Dodaj funkcję do obsługi trasy '/auth/google/callback'
function handleGoogleCallback(req, res) {
  res.redirect('/');
}

module.exports = {
  GoogleStrategy: passport.authenticate('google', { scope: ['profile', 'email'] }),
  handleGoogleCallback,
  LocalStrategy: passport.authenticate('local'),
  serializeUser: passport.serializeUser,
  deserializeUser: passport.deserializeUser
};