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
        * When user joins a new room that isn't active
        */
        socket.on('join_room', function(data) {
            // Make sure the user isn't blocked and isn't already in the room
            Room.findOne({_id: data._room, _users: {$ne: userId}, _blocked: {$ne: userId}}, function(err, room) {
                if (!err && room) {
                    User.findOne({_id: userId}, function(err, userInfo) {                        
                        // If the room doesn't already exist as an active room, make it an active room
                        User.update({_id: userId}, {$addToSet: { active_rooms: data._room }}, function(err) { console.log(err)});
                        // Add the user to the rooms list of users
                        Room.findOneAndUpdate({_id: data._room}, {$addToSet: { _users: userId}}, {new: true}, function(err, room) { 
                            if (!err && room) {
                                // emit to all that the room object has changed
                                io.emit('room_update_' + data._room, room);
                                // Emit to the user so that a dynamic socket can be created
                                socket.emit('joined_room', room);                            }
                        });
                        // Create a new system message to send to the room
                        var message = new Message({
                            _owner: userId,
                            _room: data._room,
                            resource_type: 'System',
                            time: Date.now(),
                            message: userInfo.username + ' has joined the room.'
                        });
                        // Attempt to save the message
                        message.save(function(err) {
                            if (!err) {
                                // If there are no errors, emit the message to the room
                                io.emit('room_' + data._room, message);
                                // Emit an event to those that have the room docked
                                io.emit('docked_' + data._room);
                                // Remove the room from the recently visited arrays if it exits and then push it
                                // Last in, First out in order of most recently visited
                                User.findOneAndUpdate({_id: userId}, {$pull: { recent_rooms: data._room }}, function(err, user) {
                                    if (!err && user) {
                                        User.findOneAndUpdate({_id: userId}, {$push: {recent_rooms: data._room}}, {select: '-password'}, function(err, user) {
                                            if (!err && user) {
                                                // User has changed
                                                socket.emit('user_update', user);
                                            }
                                        });
                                    }
                                });
                            } else {
                                //There was an error saving the message for some reason
                                // Probably shouldn't display it to the room
                                console.log(err);
                            }
                        });
                    });
                } else {
                    // Couldn't join the room
                }                    
            });
        });

        /**
        * Listens for when a user closes a room
        */
        socket.on('leave_room', function(data) {
            // Find the room and pull the user from the _users list
            Room.findOneAndUpdate({_id: data._room, _users: userId}, {$pull: {_users: userId}}, {new: true}, function(err, room) {
                console.log(room);
                if (!err && room) {
                    // emit to all that the room object has changed
                    io.emit('room_update_' + data._room, room);
                    // emit to the user that he has successfully left the room
                    socket.emit('left_room', room);
                    // Pull the room from the users active rooms
                    User.findOneAndUpdate({_id: userId}, {$pull: {active_rooms: data._room}}, {new: true, select: '-password'}, function(err, user) {
                        if (!err && user) {
                            socket.emit('user_update', user);
                            var message = new Message({
                                _owner: userId,
                                _room: data._room,
                                resource_type: 'System',
                                time: Date.now(),
                                message: user.username + ' has left the room.'
                            });
                            message.save(function(err) {
                                if (!err) {
                                    io.emit('room_' + data._room, message);
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