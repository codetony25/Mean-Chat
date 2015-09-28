/**
 * Module dependencies
 */
var config = require('./config/config');   
var mongoose = require('./config/mongoose');
var express = require('./config/express');
var passport = require('./config/passport');

var db = mongoose();
var passport = passport();
var app = express();
var routes = require('./config/routes')(app);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(config.port, function() {
	console.log('Mean Chat app server running on port ' + config.port);
});

io.sockets.on('connection', function() {
	console.log('Sockets working');
});

module.exports = app;