const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  }
  // dodaj inne pola, jeśli są potrzebne
});

UserSchema.statics.findOrCreate = async function (conditions, doc) {
  const user = await this.findOne(conditions);
  if (user) {
    return user;
  } else {
    return this.create(doc);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;