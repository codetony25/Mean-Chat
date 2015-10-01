/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('mongoose').model('User');

/**
 * Expose
 */
router.get('/', function(req,res,next) {
    res.json("ok");
});

// Register/create user
router.post('/', function( req, res, next) {
    var user = new User(req.body);
    console.log('HERE');
    user.save( function(err) {
        if(err) {
            return res.status(401).json(err);
        }

        return res.json({state: 'success'});
    })
});

router.get('/logout', function(req, res) {
    req.logout();
    // Send back response
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/success',
    failureRedirect: '/users/failure'
}));

router.get('/success', function(req, res) {
    console.log('success');
    var user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    } || null;
   
   return res.json({state: 'success', user: user } );
});

router.get('/failure', function(req, res){
    res.status(401).json({ 
        errors: {
            login: { message: 'Invalid username or password' }
        }
    });
});

router.get('/:id', function(req, res, next) {
    User.findById(req.params.id).select('-password -__v').populate('active_rooms favorite_rooms recent_rooms created_rooms').exec(function(err, user) {
        if (err) {
            return res.status(400).json(err);
        }
        return res.json({state: 'success', user: user});
    });
})

module.exports = router;