/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

var messageValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 500],
        message: 'Messages should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var MessageSchema = new mongoose.Schema({
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    message: {
        type: String,
        required: true,
        trim: true,
        validate: messageValidator
    },
    resource_type: {
        type: String,
        required: true
    },
    _upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    _downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// MessageSchema.pre('save', function(next) {
//     this.resource_type = MessageSchema.methods.getResourceType(this.message);
//     return next();
// });

/**
 * Returns the resource type of a message
 */
// MessageSchema.methods.getResourceType = function(message) {
//     if (message.substring(0, 2).toUpperCase() == '/Q') {
//         return 'question';
//     } else if (message.substring(0, 2).toUpperCase() == '/L') {
//         return 'link';
//     } else {
//         return 'text';
//     }
// }

mongoose.model('Message', MessageSchema);
