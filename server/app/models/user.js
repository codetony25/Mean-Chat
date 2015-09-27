/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	displayName: String,
	name: {
		firstName: String,
		middleName: String,
		lastName: String
	},
	emails: [{
		value: String,
		type: String,
	}],
	photos: [{
		value: String
	}],
	provider: String,
	updated: Date
});

UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

UserSchema.methods.validatePassowrd = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('User', UserSchema);