/**
 * Module dependencies
 */
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	name: String,
  	_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	_admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  	invite: {type: Boolean, default: false},
  	max_users: {type: Number, default: -1},
  	count: Number
});

mongoose.model('Room', RoomSchema);