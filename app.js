const express = require('express');
const path = require('path');
const api = require('./api');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '693207663415-rmir0f0vo1k24r74c339aggvjq62tvat.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  })
);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.use('/api', ensureAuthenticated, api);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
