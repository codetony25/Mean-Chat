/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var config = require('./config');
var fs = require('fs'); 

// Bootstrap models
fs.readdirSync(config.serverRoot + '/app/models').forEach(function(file) {
  if(~file.indexOf('.js')) require(config.serverRoot + '/app/models/' + file);
});

/**
 * Expose
 */
module.exports = function() {
	var db = mongoose.connect(config.db);

	mongoose.connection.on('error', console.log);

	return db;
}