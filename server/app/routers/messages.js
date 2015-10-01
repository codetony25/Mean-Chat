var express = require('express');
var router = express.Router();
var Message = require('mongoose').model('Message');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

/**
 * Protect routes that require authentication.
 *
 * If user is authenticated in the session, call next().
 * Method is added to the request object by passport.
 */
var isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/#login');
}

//Register authentication middleware
router.use(isAuthenticated);

/**
 * Expose
 */
router.get('/', function(req, res) {

});

router.get('/q', function( req, res, next) {
    Message.find(req.query).sort('_id').limit(50).exec()
        .then( function(messages) {

            return res.json({
                success: true,
                content: messages
            });
        })
        .catch(function(err) {
            console.log('/messages/q route error:', err);
            return res.status(400).json(err);
        });
});

module.exports = router;