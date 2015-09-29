var socketio = require('socket.io');
var session = require('express-session');
var Message = require('mongoose').model('Message');
var UserInfo = require('mongoose').model('UserInfo');
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
        console.log(socket.request.session);
        //socket.request.session.passport.user <--user id
    });

    return io;

}
