const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./userModel');
const { googleClientId, googleClientSecret, googleCallbackURL } = require('./config');


const strategy = new GoogleStrategy(
  {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackURL
     },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const user = await User.findOrCreate(
        { googleId: profile.id },
        { displayName: profile.displayName }
      );
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

const serializeUser = (user, done) => {
  done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = {
  authController: {
    GoogleStrategy: strategy,
    serializeUser,
    deserializeUser
  }
};