const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/*', function(req, res, next) {
  console.log('========================================================================================================================')
  console.log(req.user);
  console.log('========================================================================================================================')
  if (req.user) {
    if (toString(req.params['0']) === toString(req.user.id)) {
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
