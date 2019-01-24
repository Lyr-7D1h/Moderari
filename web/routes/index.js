const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.passport) {
    // console.log(req.session.passport.user);
  }
  res.render('index', { title: 'Moderari || Home', user: req.user });
});

/**
 * OAUTH
 */
router.get('/auth/discord', passport.authenticate('discord'));

router.get('/auth/discord/callback', 
  passport.authenticate('discord', {failureRedirect: '/'}), 
  function(req, res) {
    res.locals.session = req.session
    res.redirect(`/users/${req.session.passport.user.id}`) // Successful auth
  }
);

router.get('/servers', function(req, res, next) {
  res.render('servers', { title: 'Moderari || Servers', user: req.user });
});

router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Moderari || News', user: req.user });
});


router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;