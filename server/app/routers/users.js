var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('mongoose').model('User');

router.get('/', function(req,res,next) {
  
});

// Register
router.post('/', function( req, res, next) {
  var user = new User(req.body);

  user.save( function(err) {
    if(err) {
      return res.status(401).json(err);
    }

    return res.json(true);
  })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/users/success',
  failureRedirect: '/users/failure'
}));

router.get('/success', function(req, res) {
  return res.send({state: 'success', user: req.user ? req.user : null } );
});

router.get('/failure', function(req, res){
  res.send({state: 'failure', user: null, message: "Invalid username or password"});
});

module.exports = router;