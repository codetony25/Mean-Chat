/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

var local = require('./strategies/local');

/**
 * Expose
 */
 module.exports = function() {
  /**
   * Passport Session set up
   *
   * Required for persistent login sessions. 
   * Passport needs ability to serialize and deserialize users out of session
   */
 	passport.serializeUser(function(user, done) {
 		done(null, user.id);
 	});

 	passport.deserializeUser(function(id, done) {
 		User.findById(id, function(err, user) {
 			done(err, user);
 		})
 	});

  // Use strategies
  passport.use(local);
 }