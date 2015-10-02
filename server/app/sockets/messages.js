var session = require('express-session');
var Entities = require('html-entities').XmlEntities;
var entities = new Entities();
var User = require('mongoose').model('User');
var Message = require('mongoose').model('Message');
var Room = require('mongoose').model('Room');

module.exports = function(io, socket, currUser) {

    /**
    * Recieving a new message from the client
    */
    socket.on('message/new', function(data) {

        // Get the user
        User.findOne({_id: currUser._id}, function(err, user) {
            if (!err && user) {
                // Make sure the user is active in the room
                Room.findOne({_id: data._room, _users: currUser._id}, function(err, room) {
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
                            _owner: currUser._id,
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
                                io.emit('room/' + data._room + '/message', message);
                                // Once we've emitted to the room, update the users message count and last activity
                                User.findOneAndUpdate({_id: currUser._id}, { $inc: {message_count: 1}, last_activity: Date.now()}, {new: true, select: '-password -__v'}, function(err, user) { 
                                    if (!err && user) {
                                        // socket.emit('user_update', user);
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

	/**
	* Toggles whether or not a user has saved a message as a resource
	*/
	socket.on('message/resource', function(data) {
		Message.findOne({_id: data._message}, function(err, message) {
			if (!err && message) {
				User.findOne({_id: currUser._id}, function(err, user) {
					if (!err && user) {
						if ((idx = user._resources.indexOf(data._message)) == -1) {
							user._resources.push(data._message);
						} else {
							user._resources.slice(idx, 1);
						}
						User.update({_id: currUser._id}, {_resources: user._resources}, function(err) {});
					}
				});
			}
		});
	});

	/**
	* Deletes a message from the room -
	* The user must be an admin to delete it
	*/
	socket.on('message/delete', function(data) {
		Message.findOne({_id: data._message}, function(err, message) {
			if (!err && message) {
				Room.findOne({_id: message._room, _admins: currUser._id}, function(err, room) {
					if (!err && room) {
						message.delete(function(err) {
							if (!err) {
								// Emits the message Id back to the room
								io.emit('room/' + room._id + '/message/deleted', {_id: message._id});
							}
						});
					}
				});
			}
		});
	});

	/**
	* Upvotes/Downvotes a message and emits the new message object to the room
	*/
    socket.on('message/vote', function(data) {
    	if (data && data.vote == 'up') {
    		Message.findOneAndUpdate({_id: data._message, $ne: { _upvotes: currUser._id}}, {$addToSet: {_upvotes: currUser._id}}, {new: true}, function(err, message) {
    			if (!err && message) {
    				io.emit('room/' + message._room + '/message/update', message);
    			}
    		});
    	} else if (data && data.vote == 'down') {
    		Message.findOneAndUpdate({_id: data._message, $ne: { _downvotes: currUser._id}}, {$addToSet: {_downvotes: currUser._id}}, {new: true}, function(err, message) {
    			if (!err && message) {
    				io.emit('room/' + message._room + '/message/update', message);
    			}
    		});
    	}
    });

}