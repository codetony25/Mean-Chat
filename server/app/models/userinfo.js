/**
 * Module dependencies
 */
var mongoose = require('mongoose');

var UserInfoSchema = new mongoose.Schema({
	active_rooms: [{
		_room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
		upvotes: Number,
		downvotes: Number,
		message_count: Number
	}],
	inactive_rooms: [{
		_room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
		upvotes: Number,
		downvotes: Number,
		message_count: Number
	}]
});

mongoose.model('UserInfo', UserInfoSchema);