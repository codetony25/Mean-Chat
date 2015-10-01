/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

/**
 * Moongoose-Validator Validations
 */
var roomValidator = [
    // validate({
    //     validator: 'isAlphanumeric',
    //     message: 'Room names should contain alpha-numeric characters only'
    // }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Room names should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var topicValidator = [
	validate({
		validator: 'isLength',
		arguments: [3, 30],
		message: 'Room topics should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];
var RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: roomValidator
    },
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _admins: [{ 
    	type: String 
    }],
    _blocked: [{ 
    	type: String 
    }],
	invite: {
        type: Boolean,
        default: false
    },
    max_users: {
        type: Number,
        default: -1
    },
    topic: {
    	type: String,
    	trim: true,
    	validator: topicValidator,
    	default: 'A topic has not been set.'
    },
    _users: [{
    	type: String
    }]
});

mongoose.model('Room', RoomSchema);
