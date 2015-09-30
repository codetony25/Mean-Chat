var express = require('express');

var passport = require('passport');
var User = require('mongoose').model('User');

module.exports = function() {
    var router = express.Router();

    router.get('/', function(req,res,next) {

    });

    // Register
    router.post('/', function( req, res, next) {
        var user = new User(req.body);

        user.save( function(err) {
            if(err) {
                return res.status(401).json(err);
            }

            return res.json({state: 'success'});
        })
    });

    router.post('/logout', function() {
        // TO DO
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
        User.findById(req.params.id, '-password -__v', function(err, user) {
            if(err){
                return res.status(400).json(err);
            }
            return res.json({state: 'success', user: user });
        })
    })

    return router;
}