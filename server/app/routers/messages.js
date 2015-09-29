var express = require('express');
var router = express.Router();
var Message = require('mongoose').model('Message');

router.post('/', function(req, res) {
	/*
		Post Message route -
		Messages will have to go through a parser to determine resource type
		and other manipulations
	*/

});

module.exports = router;