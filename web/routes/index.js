const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const flash = require('express-flash');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Moderari || Home', user: req.user });
});

router.get('/documentation', function(req, res, next) {
  res.render('documentation', { title: 'Moderari || Documentation', user: req.user });
});

router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Moderari || News', user: req.user });
});

/**
 * OAUTH
 */
router.get('/auth/discord', passport.authenticate('discord'));
router.get('/auth/discord/callback', 
  passport.authenticate('discord', {failureRedirect: '/'}), 
  function(req, res) {
    res.locals.session = req.session
    req.flash('success', `Welcome ${req.session.passport.user.username}`);
    res.redirect(`/users/${req.session.passport.user.id}`) // Successful auth
  }
);

router.get('/logout', function (req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;