const passport = require('passport');

exports.loginWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};
