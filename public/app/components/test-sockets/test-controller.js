(function() {
    'use strict';

    angular
        .module('meanChat.test')
        .controller('TestController', TestController);

    TestController.$inject = ['DashboardFactory', 'mySocket'];

    function TestController(DashboardFactory, mySocket) {

        this.sendMessage = function() {
            /**
            * Sends a message to the server, as long as it's a good message
            * the server will emit to room_<<roomid>> with the message object to 
            * be displayed to all users active
            */
            mySocket.emit('new_message', {
                _room: '560ae3776c83c0004e8c637d',
                message: 'I said something.',
                resource_type: 'Text'
            });
        }

        this.leaveRoom = function() {
            /**
            * Should emit when a user leaves a room for good
            */
            mySocket.emit('leave_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.joinRoom = function() {
            /**
            * Should emit when a user joins a new room  that isn't in his active rooms
            */
            mySocket.emit('join_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.voteUp = function() {
            /**
            * Should Emit when a user clicks to upvote a message
            */
            mySocket.emit('msg_vote', {
                _room: '560ae3776c83c0004e8c637d',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'up'
            });
        }

        this.voteDown = function() {
            /**
            * Should emit when a user clicks to downvote a message
            */
            mySocket.emit('msg_vote', {
                _room: '560ae3776c83c0004e8c637d',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'down'
            });
        }

        this.favoriteRoom = function() {
            /**
            * Mark or unmark a room as a favorite.
            * This emitter will toggle whether the room is a favorite or not
            * and an updated user object will be emitted to user_update
            */
            mySocket.emit('favorite_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.getRoom = function() {
            /**
            * get_room fires a request for updated room data
            * listen at mySocket.on(room_update_<<roomid>>)
            *
            * Even if emitted, it will only fire back from the server if
            * the user is active in the room
            */
            mySocket.emit('get_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.getUser = function() {
            /**
            * get_user fires a request to update the logged in
            * users information and sends the updated user object
            * back to mySocket.on('user_update')
            * Most actions will automatically fire to this socket to update
            * the user, but this will also be available for special cases.
            *
            * Note that you don't need to pass a user ID. We will only be sending
            * back the logged in user information.
            */
            mySocket.emit('get_user');
        }

        this.roomCreated = function() {
            /**
            * When a new room is successfully created, emit the roomId
            * to the server so the server can update everyone's room list
            *
            * The server will emit back to new_room if it finds the new room object
            */
            mySocket.emit('room_created', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        /**
        * Dynamic listeners for room messages
        */
        mySocket.on('room_560ae3776c83c0004e8c637d', function(message) {
            console.log('room_<<some id>> message received');
            console.log('---------------------------------');
            console.log(message);
        });

        /**
        * Dynamic listener for room upadtes
        */
        mySocket.on('room_update_560ae3776c83c0004e8c637d', function(room) {
            console.log('room_update_<<some id>> update received');
            console.log('---------------------------------------');
            console.log(room);
        });

        /**
        * Dynamic listener for user updates for this user
        */
        mySocket.on('user_update', function(user) {
            console.log('user_update has received new user data');
            console.log('---------------------------------------');
            console.log(user);
        });

        /**
        * Response to successfully joining a room
        */
        mySocket.on('joined_room', function(room) {
            console.log('You have successfully joined room: ', room._id);
        });

        /**
        * Response to successfully leaving a room
        */
        mySocket.on('left_room', function(room) {
            console.log('You have successfully left room: ', room._id);
        });

        /**
        * Recieves a new room object when a new room is created
        */
        mySocket.on('new_room', function(room) {
            console.log('A new room has been created');
            console.log('---------------------------');
            console.log(room);
        });

    }

})();
