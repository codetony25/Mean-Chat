/**
 * Module dependencies
 */
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  	_owner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	_room_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  	content: String,
  	type: String
});

mongoose.model('Message', MessageSchema);