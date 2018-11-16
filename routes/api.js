var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("get /", req.user.userId);
  res.sendStatus(200);
});

module.exports = router;
