var socketio = require('socket.io');
var session = require('express-session');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var User = require('mongoose').model('User');
var Message = require('mongoose').model('Message');
var Room = require('mongoose').model('Room');
var MongoDBStore = require('connect-mongodb-session')(session);

// MongoDB Session Stores
var store = new MongoDBStore({
    uri: 'mongodb://localhost/mean_chat',
    collection: 'mySessions'
});

var sessionMiddleware = session({
    saveUninitialized: true,
    resave: true,
    secret: "tonyIsAwesome",
    store: store
});

// Catch errors 
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', function(socket) {
        var userId = socket.request.session.passport.user;

        /**
        * Recieving a new message from the client
        */
        socket.on('new_message', function(data) {
            // Encode the message to prevent xss/script injection
            var msg = entities.encode(data.message);

            // After encoding check for BBCode markup
            msg = msg.replace('[b]','<b>').replace('[/b]','</b>');
            msg = msg.replace('[i]','<i>').replace('[/i]','</i>');
            msg = msg.replace('[u]','<u>').replace('[/u]','</u>');
            msg = msg.replace('[s]','<s>').replace('[/s]','</s>');

            // Create the message object to save
            var message = new Message({
                _owner: userId,
                _room: data._room,
                time: Date.now(),
                message: msg,
                resource_type: data.resource_type
            });

            // Attempt to save the message
            message.save(function(err) {
                if (!err) {
                    // If there are no errors, emit the message to the room
                    io.emit('room_' + data._room, message);
                    // Emit an event to those that have the room docked
                    io.emit('docked_' + data._room);
                    // Once we've emitted to the room, update the users message count
                    User.update({_id: userId}, { $inc: {message_count: 1}, last_activity: Date.now() }, function(err) { 
                        console.log('here');
                        if (err) {
                            console.log(err);
                        } 
                    });
                } else {
                    //There was an error saving the message for some reason
                    // Probably shouldn't display it to the room
                    console.log(err);
                }
            });
        });

        /**
        * When user joins a new room that isn't active
        */
        socket.on('join_room', function(data) {
            console.log(data);
            Room.findOne({_id: data._room}, function(err, room) {
                // Make sure the user isn't blocked and isn't already in the room

                if ((room._blocked.indexOf(userId) == -1) && (room._users.indexOf(userId) == -1)) {
                    User.findOne({_id: userId}, function(err, userInfo) {                        
                        // If the room doesn't already exist as an active room, make it an active room
                        User.update({_id: userId}, {$addToSet: { active_rooms: data._room }}, function(err) { console.log(err)});
                        // Add the user to the rooms list of users
                        Room.update({_id: data._room}, {$addToSet: { _users: userId}}, function(err) { console.log(err); });
                        // Emit to the user so that a dynamic socket can be created
                        socket.emit('joined_room', {_room: data._room});
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
                                User.update({_id: userId}, {$pull: { recent_rooms: data._room }}, function(err) { console.log(err); });
                                User.update({_id: userId}, {$push: { recent_rooms: data._room }}, function(err) { console.log(err); });
                                User.findOne({_id: userId}, {select: '-password'}, function(err, user) {
                                    if (!err) {
                                        // User has changed
                                        socket.emit('user_changed', user);
                                        // Emit to the user that he's left the room
                                        socket.emit('left_room', {_room: data._room});
                                        // Create a new system message and broadcast that the user has left the room

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
                    // The user is blocked or already in the room, emit some failure back
                }
            });
        });

        /**
        * Listens for when a user closes a room
        */
        socket.on('leave_room', function(data) {
            // Find the room
            Room.findOne({_id: data._room}, function(err, room) {
                // If there's no errors and the user is active in the room
                if (!err && (room._users.indexOf(userId) > -1)) {
                    Room.update(room, {$pull: {_users: userId}}, function(err) { console.log(err); });
                    User.findOneAndUpdate({_id: userId}, {$pull: {active_rooms: data._room}}, {new: true, select: '-password'}, function(err, user) {
                        if (!err) {
                            socket.emit('user_changed', user);
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
                } else {
                    // there was an error or the user wasn't in the room
                }
            });
        });

        socket.on('msg_vote', function(data) {
            // Find the message
            Message.findOne({_id: data._message, _room: data._room}, function(err, message) {
                if (!err) {
                    if (data.vote == 'up') {
                        // Make sure the user hasn't already upvoted this
                        if (message._upvotes.indexOf(userId) == -1) {
                            // Hasn't already upvoted this. Add user to upvotes, and remove user if he's in downvotes
                            Message.update({_id: message._id}, {$push: { _upvotes: userId }, $pull: { _downvotes: userId }}, function(err) {});
                            // Also remove it from the users information to change his personal upvote and downvote count
                            User.findOneAndUpdate({_id: userId}, {$push: { _upvotes: message._id }, $pull: { _downvotes: message._id }}, { new: true, select: '-password' }, 
                                function(err, user) {
                                    if (!err) {
                                        socket.emit('user_changed', user);
                                    }
                            });                           
                            io.emit('msg_votechange', message);
                        } else {
                            // Already upvoted so do nothing
                        }
                    } else if (data.vote == 'down') {
                        // Make sure the user hasn't already downvoted this
                        if (message._downvotes.indexOf(userId) == -1) {
                            // Hasn't already upvoted this. Add user to upvotes, and remove user if he's in downvotes
                            Message.update({_id: message._id}, {$push: { _downvotes: userId }, $pull: { _upvotes: userId }}, function(err) { console.log(err)});
                            // Also remove it from the users information to change his personal upvote and downvote count
                            User.findOneAndUpdate({_id: userId}, {$push: { _downvotes: message._id }, $pull: { _upvotes: message._id }}, { new: true, select: '-password' }, 
                                function(err, user) {
                                    if (!err) {
                                        socket.emit('user_changed', user);
                                    }
                            });                           
                            io.emit('msg_votechange', message);
                        } else {
                            // Already downvoted so do nothing
                        }
                    }
                } else {
                    // Couldn't find the message
                }
            })

        });

    });

    return io;

}
