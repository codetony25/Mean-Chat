/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
mongoose.Promise = require('q').Promise;

/**
 * Expose
 */
// Register/create user
router.post('/', function( req, res, next) {
    var user = new User(req.body);

    user.save( function(err) {
        if(err) {
            return res.status(401).json(err);
        }

        return res.json({state: 'success'});
    })
});

router.get('/logout', function(req, res, next) {
    // req.logout();
    return res.redirect('/');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/success',
    failureRedirect: '/users/failure'
}));

router.get('/success', function(req, res) {
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

    User.findById(req.params.id)
        .select('-password -__v')
            .populate({
                path: 'active_rooms',
                options: { sort: '-_id' }
            })
            .populate({
                path: 'favorite_rooms',
                options: { sort: '-_id' }
            })
            .populate({
                path: 'recent_rooms',
                options: { sort: '-_id' }
            })
            .populate({
                path: 'created_rooms',
                options: { sort: '-_id' }
            })
        .exec()
        .then( function(user) {
            return res.json({state: 'success', user: user});
        })
        .catch(function(err) {
            return res.status(400).json(err);
        });
})

module.exports = router;