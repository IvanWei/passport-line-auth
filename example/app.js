const express = require('express');
const passport = require('passport');
const LineStrategy = require('../lib').Strategy;
const jwt = require('jsonwebtoken');

const app = express();

app.set('views', __dirname);
app.set('view engine', 'pug');

passport.use(new LineStrategy({
  channelID: '[Your LINE\'s channel ID]',
  channelSecret: '[Your LINE\'s channel Secret]',
  callbackURL: 'http://[Your domain]/login/line/return',
  scope: ['profile', 'openid', 'email'],
  botPrompt: 'normal'
},
function(accessToken, refreshToken, params, profile, cb) {
  const {email} = jwt.decode(params.id_token);
  profile.email = email;
  return cb(null, profile);
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {cb(null, user);});
passport.deserializeUser(function(obj, cb) {cb(null, obj);});

// Use application-level middleware for common functionality, including
// parsing, and session handling.
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard dog', resave: true, saveUninitialized: true}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/login/line', passport.authenticate('line'));

app.get('/login/line/return',
  passport.authenticate('line', {failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/');
  });

app.listen(3000, () => console.log('Example app listening on http://localhost:3000!'))
