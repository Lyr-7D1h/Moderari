const express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/*', function(req, res, next) {
    /* DEBUG*/
    // req.user = { user: 
    //   { 
    //     username: 'Exsite',
    //     verified: true,
    //     locale: 'en-GB',
    //     mfa_enabled: false,
    //     flags: 64,
    //     avatar: '0b200715fb2ed16dca477da7a95c3c94',
    //     discriminator: '0373',
    //     email: 'ivovelthoven@hotmail.com',
    //     id: '189733525828796416',
    //     provider: 'discord',
    //     accessToken: '8XoKcggsIeNErh9wNvwDMBrLcJENZq',
    //     fetchedAt: '2019-01-24T15:45:36.752Z' 
    //   } 
    // }
  console.log('========================================================================================================================')
  console.log(req.user);
  console.log('========================================================================================================================')
  if (req.user) {
    console.log(req.params['0'], req.user.id);
    if (req.params['0'] == req.user.id) {
      console.log('render')
      res.render('users', {title: 'Moderari || Account', user: req.user}); 
    }
  }
  setTimeout(() => {
    if (!res.headersSent) {
        res.redirect('/');
    }
    }, 2000);
});

module.exports = router;
