/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var Room = require('mongoose').model('Room');

/**
 * Protect routes that require authentication.
 *
 * If user is authenticated in the session, call next().
 * Method is added to the request object by passport.
 */
var isAuthenticated = function(req, res, next) {
    // allow all GET requests
    // if(req.method === "GET") {
    //     return next();
    // }

    if(req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/#login');
}

//Register authentication middleware
// router.use(isAuthenticated);

/**
 * Expose
 */
router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {
    var newRoom = new Room(req.body);
    console.log(newRoom);
});

module.exports = router;