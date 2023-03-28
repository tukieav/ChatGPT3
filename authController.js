const passport = require('passport');
const User = require('./userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleClientId, googleClientSecret, googleCallbackURL } = require('./config');

const serializeUser = (user, done) => {
  done(null, user.id);
};

const deserializeUser = async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
};

const googleStrategy = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackURL,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Wyszukaj istniejącego użytkownika
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // Jeśli użytkownik już istnieje, zwróć go
        return done(null, existingUser);
      }

      // Jeśli nie, utwórz nowego użytkownika z googleId
      const newUser = await new User({
        googleId: profile.id,
        // ... inne dane ...
      }).save();

      return done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
);

module.exports = {
  googleStrategy,
  serializeUser,
  deserializeUser,
};