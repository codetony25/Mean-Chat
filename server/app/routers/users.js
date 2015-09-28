var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('mongoose').model('User');

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true })
);

router.post('/save', function( req, res, next) {
  console.log(req.body);
  // var user = new User(req.body);
  // user.provider = 'local';
  // user.save( function(err) {
    
  // })
});

module.exports = router;