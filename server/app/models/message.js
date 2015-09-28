/**
 * Module dependencies
 */
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  	_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  	_room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  	content: String,
  	resource_type: String,
  	_upvotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  	_downvotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

mongoose.model('Message', MessageSchema);