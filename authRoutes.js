const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    console.log('Session destroyed');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;