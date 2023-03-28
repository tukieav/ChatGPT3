const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true
  },
  displayName: String
});

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
