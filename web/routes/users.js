const express = require('express');
const database = require('../database');
var router = express.Router();

/* GET users listing. */
router.get('/*', function(req, res, next) {
  console.log('========================================================================================================================');
  console.log(req.user);
  console.log('========================================================================================================================');
  if (req.user) {
    // console.log(req.params['0'], req.user.id);
    if (req.params['0'] === req.user.id) {
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      database.new_ip(req.user.id, ip) // Check for ip
      res.render('users', {title: 'Moderari || Account', user: req.user}); 
    } 
  }
  setTimeout(() => {
    if (!res.headersSent) {
      req.flash('alert', `You must login first`);
      res.redirect('/');
    }
    }, 2000);
});

module.exports = router;
