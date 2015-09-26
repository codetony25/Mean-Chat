/**
 * Module dependencies
 */
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Expose
 */
 module.exports = function() {
 	var User = mongoose.model('User');

 	// Serialize sessions
 	passport.serializeUser(function(user, done) {
 		done(null, user.id);
 	});

 	passport.deserializeUser(function(id, done) {
 		User.load({ criteria: { _id: id } }, function(err, user) {
 			done(err, user);
 		})
 	});
 }