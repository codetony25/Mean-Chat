var socketio = require('socket.io');
var Message = require('mongoose').model('Message');
var UserInfo = require('mongoose').model('UserInfo');

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.on('connection', function(socket) {
    	console.log('sockets working');
    	
    	// socket.on('new_message', function(msg) {


    	// 	// If successfully saved to the db, emit the message
    	// 	io.emit('room'+msg.roomId, {message: message});
    	// });

    });

    return io;

}
