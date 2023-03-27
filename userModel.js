const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true
  },
  displayName: String
});
const strategy = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackURL
  },
  async function (accessToken, refreshToken, profile, done) {
    if (!profile.id) {
      return done(new Error('Profile ID is null'));
    }

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

userSchema.statics.findOrCreate = async function (condition, doc) {
  if (condition.googleId === null) {
    throw new Error('Cannot find or create user with null googleId');
  }

  const existingUser = await this.findOne(condition);
  if (existingUser) {
    return existingUser;
  }

  const newUser = new this(doc);
  await newUser.save();
  return newUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
