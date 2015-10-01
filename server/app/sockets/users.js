var session = require('express-session');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var User = require('mongoose').model('User');
var Message = require('mongoose').model('Message');
var Room = require('mongoose').model('Room');

module.exports = function(io, socket, connUser) {

    /**
    * On request, sends back profile information of a specific user
    */
    socket.on('get_profile', function(data) {
        User.findOne({_id: data._user}).select('username favorite_rooms active_rooms message_count last_activity _upvotes _downvotes').populate('favorite_rooms active_rooms').exec(function(err, user) {
            if (!err && user) {
                socket.emit('user_profile', user);
            }
        });
    });


    /**
    * Emits the user data back to the client on request
    */
    socket.on('get_user', function() {
        User.findOne({_id: connUser._id}, {}, {select: '-password'}, function(err, user) {
            if (!err && user) {
                socket.emit('user_update', user);
            } else {
                // If there's an error or we can't find the user we should probably disconnect the user and destroy the session
            }
        });
    });
    
    /**
    * Toggles blocking a user in a room if you are the user_admin for that room
    */
    socket.on('block_user', function(data) {
        Room.findOne({_id: data._room, _admins: connUser._id}, function(err, room) {
            // if there are no errors, the room is found and the user isn't trying to block himself
            if (!err && room && (connUser._id != data._user)) {
                if ((idx = room._blocked.indexOf(data._user)) != -1) {
                    // If already blocked, then unblock
                    room._blocked.splice(idx, 1);
                } else {
                    // If not blocked, then block
                    room._blocked.push(data._user);
                }
                // Now update the room
                Room.findOneAndUpdate({_id: data._room}, {_blocked: room._blocked}, function(err, room) {
                    if (!err && room) {
                        io.emit('room_update_' + data._room, room);
                    }
                });
            } else {
                // Couldn't find the room or the user isn't an admin
            }
        });
    });

}