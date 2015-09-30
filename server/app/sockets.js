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
        //socket.request.session.passport.user <--user id

        socket.on('new_message', function(data) {
            var msg = entities.encode(data.message);

            msg = msg.replace('[b]','<b>');
            msg = msg.replace('[/b]','</b>');

            message = new Message({
                _owner: userId,
                _room: data.roomId,
                message: msg,
                resource_type: data.resourceType
            });

            message.save(function(err) {
                if (!err) {
                    // If there are no errors, emit the message to the room
                    io.emit('room_' + data.roomId, {message: msg});
                    // Emit an event to those that have the room docked
                    io.emit('docked_' + data.roomId);
                    // Once we've emitted to the room, update the users message count
                    User.update({_id: userId}, { $inc: {message_count: 1}, last_activity: Date.now() }, function(err) { 
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

        socket.on('join_room', function(data) {
            Room.findOne({_id: data.roomId}, function(err, room) {
                // Make sure the user isn't blocked
                if (room._blocked.indexOf(userId) > -1) {
                    User.findOne({_id: userId}, function(err, userInfo) {
                        // If the room is in userInfo.inactive_rooms, move it to active_rooms
                    });                    
                } else {
                    // The user is blocked
                }
            });
        });


    });

    return io;

}
