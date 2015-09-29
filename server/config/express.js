/**
 * Module dependencies
 */
var express = require('express')
    ,bodyParser = require('body-parser')
    ,cookieParser = require('cookie-parser')
    ,session = require('express-session')
    ,morgan = require('morgan')
    ,flash = require('connect-flash')
    ,passport = require('passport')
    ,config = require('./config');

/**
 * Expose
 */
module.exports = function() {
	var app = express();
	// Static files middlewear
	app.use(express.static(config.publicRoot));
	app.use(express.static(config.publicRoot + '/app'));

	// Log every request to console
	app.use(morgan('dev'));

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.use(cookieParser());
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: "tonyIsAwesome"
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	// uncomment after placing your favicon in /public
	//app.use(favicon('./public/favicon.ico'));

	return app;
}