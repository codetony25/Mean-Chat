var express = require('express');
var router = express.Router();
var Message = require('mongoose').model('Message');

router.get('/', function(req, res) {
    res.json('sdfjsdk');
});

module.exports = router;