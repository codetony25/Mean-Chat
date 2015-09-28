/**
 * Module dependencies
 */
var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	name: String,
  	_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	_admin: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  	count: Number
});

mongoose.model('Room', RoomSchema);