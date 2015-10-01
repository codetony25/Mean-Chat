/**
 * Module dependencies
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var User = mongoose.model('User');
mongoose.Promise = require('q').Promise;

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
router.use(isAuthenticated);

/**
 * Expose
 */
router.get('/', function(req, res, next) {
    console.log('here');
});

router.post('/', function(req, res, next) {
    var newRoom = new Room(req.body);

    // Creator is automatically an admin of the room
    newRoom._admins.push(newRoom._owner);
    
    // Verify user IDs in session and request match
    if( newRoom._owner.toString() != req.user._id.toString() ) {
        res.status(401).json({error: 'Unauthorized request'});
    }

    newRoom.save()
        .then( function(room) {
            return User.findById(room._owner).exec();
        })
        .then( function(user) {
            user.created_rooms.push(newRoom._id);
            return user.save();
        })
        .then( function(user) {
            res.json({
                success: true,
                content: newRoom
            });
        })
        .catch(function(err) {
            console.log('/rooms post err', err);
            return res.status(400).json(err);
        });
});

router.get('/:id', function(req, res, next) {

    Room.findById(req.params.id).populate('_users', '_id username').exec()
        .then( function(room) {
            return res.json({
                sucess: true,
                content: room
            });
        })
        .catch(function(err) {
            return res.status(400).json(err);
        });
    
});

module.exports = router;