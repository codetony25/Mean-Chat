/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	name: String,
	username: { type: String },
	email: { type: String, index: { unique: true } },
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

UserSchema.pre('save', function(next) {

	// Only hash password if it has been modified (or is new)
	if( !this.isModified('password')) {
		return next();
	}

	if( !this.password || !this.password.length ) {
		return (Error('Invalid Password'));
	}

	this.password = UserSchema.methods.hashPassword(this.password);
	next();
});

UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', UserSchema);