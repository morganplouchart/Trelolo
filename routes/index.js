var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
  if(!req.session || !req.session.user)
    res.cookie('loggedIn', '')
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trelolo', user:req.session.user || {} });
});

module.exports = router;
