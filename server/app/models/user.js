/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

/**
 * Moongoose-Validator Validations
 */
var nameValidator = [
	validate({
		validator: 'isAlphanumeric',
		passIfEmpty: true,
		message: 'Name fields should contain alpha-numeric characters only'
	})
];

var usernameValidator = [
	validate({
		validator: 'isLength',
		arguments: [3, 25],
		message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
	}),
	validate({
		validator: 'isAlphanumeric',
		message: 'Username should contain alpha-numeric characters only'
	})
];

var emailValidator = [
	validate({
		validator: 'isEmail',
		messagee: 'Invalid email'
	}),
	validate({
		validator: 'isLength',
		arguments: [0, 50],
		message: 'Email should be no more than 50 characters long'
	}),
];

var passwordValidator = [
	validate(({
		validator: 'isLength',
		argument: [6, 255],
		message: 'Password should be between 6 and 255 characters'
	}))
];

/**
 * Schema for User accounts. Login / Registration
 */
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: usernameValidator
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: emailValidator
	},
	password: {
		type: String,
		required: true
	},
	name: {
		firstName: {
			type: String,
			trim: true,
			validate: nameValidator
		},
		lastName: {
			type: String,
			trim: true,
			validate: nameValidator
		}
	},
	updated: {
		type: Date,
		default: Date.now
	},
	facebook: {},
	google: {},
	twitter: {},
	/**
	* User info added..
	*/
	last_activity: Date, // To check activity and prevent spamming
    active_rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    recent_rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    favorite_rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    created_rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    message_count: {
    	type: Number,
    	default: 0
    },
    // Upvotes and downvotes hold an array of user ids that have voted
    _upvotes: [{
    	type: String
    }],
    _downvotes: [{
    	type: String
    }]
});

UserSchema.pre('save', function(next) {

	// Only hash password if it has been modified (or is new)
	if (!this.isModified('password')) {
		return next();
	}

	if (!this.password || !this.password.length) {
		return next(Error('Invalid Password'));
	}

	this.password = UserSchema.methods.hashPassword(this.password);
	return next();
});

UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.virtual('created').get(function() {
    console.log(this);
    return mongoose.Types.ObjectId(this._id).getTimestamp();
});


UserSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('User', UserSchema);