var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.use('/bot', require('./bot'));
router.use('/users', require('./user'));
router.use('/catalogue', require('./catalogue'));
router.use('/auth', require('./auth'));

module.exports = router;
