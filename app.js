const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authController = require('./authController');
const authRoutes = require('./authRoutes');
const apiRoutes = require('./apiRoutes');
const config = require('./config');

const app = express();

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(authController.googleStrategy);
passport.serializeUser(authController.serializeUser);
passport.deserializeUser(authController.deserializeUser);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
