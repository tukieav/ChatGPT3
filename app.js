const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const api = require('./api');
const authController = require('./authController');

const mongoose = require('mongoose');
const {Strategy: GoogleStrategy} = require("passport-google-oauth20");
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(authController.LocalStrategy);
passport.use(authController.GooglePassportStrategy);
passport.serializeUser(authController.serializeUser);
passport.deserializeUser(authController.deserializeUser);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use('/api', api);

app.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});