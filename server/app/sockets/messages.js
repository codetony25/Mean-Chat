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
        * Recieving a new message from the client
        */
        socket.on('new_message', function(data) {
            // Get the user
            User.findOne({_id: userId}, function(err, user) {
                if (!err && user) {
                    // Make sure the user is active in the room
                    Room.findOne({_id: data._room, _users: userId}, function(err, room) {
                        if (!err && room) {
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
                                username: user.username,
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
                                    // Once we've emitted to the room, update the users message count and last activity
                                    User.findOneAndUpdate({_id: userId}, { $inc: {message_count: 1}, last_activity: Date.now()}, {new: true, select: '-password -__v'}, function(err, user) { 
                                        if (!err && user) {
                                            socket.emit('user_update', user);
                                        } 
                                    });
                                } else {
                                    //There was an error saving the message for some reason
                                    // Probably shouldn't display it to the room
                                    console.log(err);
                                }
                            });
                        }
                    });
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
                                        socket.emit('user_update', user);
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
                                        socket.emit('user_update', user);
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
}