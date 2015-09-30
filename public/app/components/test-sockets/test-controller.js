(function() {
    'use strict';

    angular
        .module('meanChat.test')
        .controller('TestController', TestController);

    TestController.$inject = ['DashboardFactory', 'mySocket'];

    function TestController(DashboardFactory, mySocket) {

        this.leaveRoom = function() {
            mySocket.emit('leave_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.joinRoom = function() {
            mySocket.emit('join_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        this.voteUp = function() {
            mySocket.emit('msg_vote', {
                _room: '560ae3776c83c0004e8c637d',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'up'
            });
        }

        this.voteDown = function() {
            mySocket.emit('msg_vote', {
                _room: '560ae3776c83c0004e8c637d',
                _message: '560c334f6fc86bbc2f2e4368',
                vote: 'down'
            });
        }

        this.getRoom = function() {
            /**
            * get_room fires a request for updated room data
            * listen at mySocket.on(room_update_<<roomid>>)
            */
            mySocket.emit('get_room', {
                _room: '560ae3776c83c0004e8c637d'
            });
        }

        mySocket.on('room_560ae3776c83c0004e8c637d', function(message) {
            console.log('room_<<some id>> message received');
            console.log('---------------------------------');
            console.log(message);
        });

        mySocket.on('room_update_560ae3776c83c0004e8c637d', function(room) {
            console.log('room_update_<<some id>> update received');
            console.log('---------------------------------------');
            console.log(room);
        });

        mySocket.on('user_changed', function(user) {
            console.log('user_changed has received new user data');
            console.log('---------------------------------------');
            console.log(user);
        });
    }

})();
