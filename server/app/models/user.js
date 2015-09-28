/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	name: String,
	username: String,
	email: String,
	password: String,
	name: {
		firstName: String,
		lastName: String
	},
	updated: Date,
	facebook: {},
	google: {},
	twitter: {}
});

UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

UserSchema.methods.validatePassowrd = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', UserSchema);