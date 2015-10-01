var express = require('express');
var router = express.Router();
var Message = require('mongoose').model('Message');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

router.get('/', function(req, res) {

});

router.get('/q', function( req, res, next) {
    Message.find(req.query).sort('_id').limit(50).exec()
        .then( function(messages) {

            return res.json({
                success: true,
                content: messages
            });
        })
        .catch(function(err) {
            console.log('/messages/q route error:', err);
            return res.status(400).json(err);
        });
});

module.exports = router;