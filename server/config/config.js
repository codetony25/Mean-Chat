/**
 * Module dependencies
 */
process.env.NODE_ENV  = process.env.NODE_ENV || 'development';

var path = require('path');
var extend = require('util')._extend;

var config = require('./env/' + process.env.NODE_ENV + '.js');

var defaults = {
	serverRoot: path.normalize(__dirname + '/..'),
	publicRoot: path.normalize(__dirname + '/../../public')
}

/**
 * Expose
 */
module.exports = extend(config, defaults);