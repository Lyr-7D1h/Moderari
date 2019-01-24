const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/*', function(req, res, next) {
  if (req.session.passport) {
    if (req.params['0'] == req.session.passport.user.id) {
      console.log('users page')
      let user_data = req.session.passport.user;
      console.log(user_data);
      res.render('users', {title: 'Moderari || Account'}); 
    }
  }
  setTimeout(() => {
    if (!res.headersSent) {
        res.redirect('/');
    }
    }, 2000);
});

module.exports = router;
