var session = require('express-session');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var User = require('mongoose').model('User');
var Message = require('mongoose').model('Message');
var Room = require('mongoose').model('Room');

module.exports = function(io) {

	io.on('connection', function(socket) {
        var userId = socket.request.session.passport.user;

        /**
        * When a new room has been created, the owner emits to the server, the server finds the new room and emits to all
        */
        socket.on('room_created', function(data) {
            Room.findOne({_id: data._room}, function(err, room) {
                if (!err && room) {
                    io.emit('new_room', room);
                }
            });
        });

        /**
        * Emits room data to the client as long as he's active in that room
        */
        socket.on('get_room', function(data) {
            Room.findOne({_id: data._room, _users: userId}, function(err, room) {
                if (!err && room)  {
                    socket.emit('room_update_' + data._room, room);
                } else {
                    // there was an error or the room doesn't exist
                }
            });
        });

        /**
        * When user joins the room
        */
        socket.on('room/user/join', function(data) {
            // Make sure the user isn't blocked and isn't already in the room
            Room.findOne({_id: data._room, _blocked: {$ne: userId}}, function(err, room) {
                if (!err && room) {
                    User.findOne({_id: userId}, function(err, user) {
                        if (!err & user) {
                            // If the user isn't already on the list, add him to the list
                            if (room._users.indexOf(userId) == -1) {        
                                // Create a new system message to send to the room
                                var message = new Message({
                                    _owner: userId,
                                    _room: data._room,
                                    resource_type: 'System',
                                    time: Date.now(),
                                    message: user.username + ' has joined the room.'
                                });
                                // Attempt to save the message
                                message.save(function(err) {
                                    if (!err) {
                                        // If there are no errors, emit the message to the room
                                        io.emit('room/' + data._room + '/message', message);
                                    } else {
                                        //There was an error saving the message for some reason
                                        // Probably shouldn't display it to the room
                                    }
                                });
                            }

                            // If the room doesn't already exist as an active room, make it an active room
                            User.update({_id: userId}, {$addToSet: { active_rooms: data._room }, $addToSet: { recent_rooms: data._room}}, function(err) { });
                            // Add the user to the rooms list of users
                            Room.update({_id: data._room}, {$addToSet: { _users: userId}}, {new: true}, function(err, room) { });

                        }
                    });
                } else {
                    // Couldn't join the room
                }                    
            });

        });

        /**
        * When user requests authorization to join a room
        */
        socket.on('room/auth/req', function(data) {
            // Make sure the user isn't blocked and isn't already in the room
            Room.findOne({_id: data._room, _blocked: {$ne: userId}}, function(err, room) {
                if (!err && room) {
                    socket.emit('room/auth/success', {_room: room._id}); 
                } else {
                    // Couldn't join the room
                }          
            });
        });

        /**
        * Listens for when a user closes a room
        */
        socket.on('room/user/exit', function(data) {
            // Find the room and pull the user from the _users list
            Room.findOneAndUpdate({_id: data._room, _users: userId}, {$pull: {_users: userId}}, {new: true}, function(err, room) {
                if (!err && room) {
                    // Pull the room from the users active rooms
                    User.findOneAndUpdate({_id: userId}, {$pull: {active_rooms: data._room}}, {new: true, select: '-password'}, function(err, user) {
                        if (!err && user) {
                            // emit to all that the user has exited
                            io.emit('room/' + data._room, room + '/user/exited', {username: user.username, _id: user._id});
                            var message = new Message({
                                _owner: userId,
                                _room: data._room,
                                resource_type: 'System',
                                time: Date.now(),
                                message: user.username + ' has left the room.'
                            });
                            message.save(function(err) {
                                if (!err) {
                                    io.emit('room/' + data._room + '/message', message);
                                } else {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        });

        /**
        * Toggles a room as favorite and emits the updated user object
        */
        socket.on('favorite_room', function(data) {
            // Make sure the room exists
            Room.findOne({_id: data._room}, function(err, room) {
                if (!err && room) {
                    User.findOne({_id: userId}, function(err, user) {
                        if (!err && user) {
                            if ((idx = user.favorite_rooms.indexOf(data._room)) != -1) {
                                // It is a favorite already, remove it
                                user.favorite_rooms.splice(idx, 1);
                            } else {
                                // It's not a favoite, so add it
                                user.favorite_rooms.push(data._room);
                            }
                            // Now update the user
                            User.findOneAndUpdate({_id: userId}, {favorite_rooms: user.favorite_rooms}, {new: true, select: '-password'}, function(err, user) {
                                if (!err && user) {
                                    // Send the updated user object back
                                    socket.emit('user_update', user);
                                }
                            });
                        }
                    });
                }
            });
        });

    });
}