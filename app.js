const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const apiRoutes = require('./apiRoutes');
const authRoutes = require('./authRoutes');
const { mongodbPath, mongodbDatabase } = require('./config');
const { strategy: GoogleStrategy, serializeUser, deserializeUser } = require('./authController');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(`${mongodbPath}${mongodbDatabase}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'some-random-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(GoogleStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});