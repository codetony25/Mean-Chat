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
    io = socketio.listen(app);

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', function(socket, string) {

        if (socket.request.session.passport) {
            var userId = socket.request.session.passport.user;
            // Don't add any listeners if we can't find the user
            User.findById({_id: userId}, function(err, user) {
                if (!err && user) {
                    require('./users.js')(io, socket, user);
                    require('./rooms.js')(io, socket, user);
                    require('./messages.js')(io, socket, user);
                }
            });                
        } else {
            socket.on('user_logged_in', function(data) {
                var userId = data._id;
                // Don't add any listeners if we can't find the user
                User.findById({_id: userId}, function(err, user) {
                    if (!err && user) {
                        require('./users.js')(io, socket, user);
                        require('./rooms.js')(io, socket, user);
                        require('./messages.js')(io, socket, user);
                    }
                });                
            });
        }

    });


}
