var session = require('express-session');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var User = require('mongoose').model('User');
var Message = require('mongoose').model('Message');
var Room = require('mongoose').model('Room');

module.exports = function(io, socket, currUser) {

    /**
    * On request, sends back profile information of a specific user
    */
    socket.on('user', function(data) {
        User.findOne({_id: data._user}).select('username favorite_rooms active_rooms message_count last_activity _upvotes _downvotes').populate('favorite_rooms active_rooms').exec(function(err, user) {
            if (!err && user) {
                socket.emit('user/profile', user);
            }
        });
    });
    
    /**
    * Toggles blocking a user in a room if you are the user_admin for that room
    */
    socket.on('block_user', function(data) {
        Room.findOne({_id: data._room, _admins: currUser._id}, function(err, room) {
            // if there are no errors, the room is found and the user isn't trying to block himself
            if (!err && room && (currUser._id != data._user)) {
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

    /**
    * When a socket disconnects, have the user leave the room but it can stay in his active rooms
    */
    socket.on('disconnect', function() {
        Room.find({_users: currUser._id}, function(err, rooms) {
            if (!err && rooms) {
                rooms.forEach(function(room) {
                    var message = new Message({_owner: currUser._id, _room: room._id, resource_type: 'System', time: Date.now(), message: currUser.username + ' has left the room.' });
                    // Attempt to save the message
                    message.save(function(err) {
                        if (!err) {
                            // If there are no errors, emit the message to the room
                            io.emit('room/' + room._id + '/message', message);
                        } 
                    });
                });
            }
        })
    });

}