const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /* DEBUG*/
  req.session.passport = { user: 
    { 
      username: 'Exsite',
      locale: 'en-GB',
      mfa_enabled: false,
      flags: 64,
      avatar: '0b200715fb2ed16dca477da7a95c3c94',
      discriminator: '0373',
      id: '189733525828796416',
      provider: 'discord',
      accessToken: '8XoKcggsIeNErh9wNvwDMBrLcJENZq',
      fetchedAt: '2019-01-24T15:45:36.752Z' 
    } 
  }

  if (req.session.passport) {
    // console.log(req.session.passport.user);
  }
  res.render('index', { title: 'Moderari || Home' });
});

/**
 * OAUTH
 */
router.get('/auth/discord', passport.authenticate('discord'));

router.get('/auth/discord/callback', 
  passport.authenticate('discord', {failureRedirect: '/'}), 
  function(req, res) {
    console.log(`/users/${req.session.passport.user.id}`);
    res.locals.session = req.session
    res.redirect(`/users/${req.session.passport.user.id}`) // Successful auth
  }
);

router.get('/servers', function(req, res, next) {
  res.render('servers', { title: 'Moderari || Servers' });
});

router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Moderari || News' });
});


router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;