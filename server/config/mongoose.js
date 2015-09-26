/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var config = require('./config');

/**
 * Expose
 */
module.exports = function() {
	var db = mongoose.connect(config.db);

	mongoose.connection.on('error', console.log);

	return db;
}