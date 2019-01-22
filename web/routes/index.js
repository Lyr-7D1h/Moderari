const express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Moderari || Home' });
});
router.get('/servers', function(req, res, next) {
  res.render('servers', { title: 'Moderari || Servers' });
});
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Moderari || News' });
});

module.exports = router;
