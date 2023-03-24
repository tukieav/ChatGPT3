const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  // pozostałe pola, jeśli są potrzebne
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return callback(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (res) {
          return callback(null, user);
        } else {
          return callback(null, false, { message: 'Incorrect password.' });
        }
      });
    })
    .catch(err => callback(err));
};

const User = mongoose.model('User', UserSchema);
module.exports = User;