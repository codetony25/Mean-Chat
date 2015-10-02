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
        socket.on('user_logged_in', function(data) {

                // var userId = socket.request.session.passport.user;
                var userId = data._id;

                // Don't add any listeners if we can't find the user
                User.findById({_id: userId}, function(err, user) {

                    if (!err && user) {
                        require('./users.js')(io, socket, user);
                        require('./rooms.js')(io, socket, user);
                        require('./messages.js')(io, socket, user);

                        /**
                        * When a socket disconnects, have the user leave the room but it can stay in his active rooms
                        */
                        socket.on('disconnect', function() {
                            Room.find({_users: userId}, function(err, rooms) {
                                if (!err && rooms) {
                                    rooms.forEach(function(room) {
                                        var message = new Message({_owner: userId, _room: room._id, resource_type: 'System', time: Date.now(), message: user.username + ' has joined the room.' });
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
                });


        });
        

    });

}
