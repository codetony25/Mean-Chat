/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

var UserInfoSchema = new mongoose.Schema({
	last_message: Date, // To check activity and prevent spamming
    active_rooms: [{
        _room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
        upvotes: Number,
        downvotes: Number,
        message_count: Number
    }],
    inactive_rooms: [{
        _room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
        upvotes: Number,
        downvotes: Number,
        message_count: Number
    }]
});

mongoose.model('UserInfo', UserInfoSchema);
