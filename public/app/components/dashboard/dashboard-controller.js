(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'ChatFactory', 'UserAuthFactory', '$state', 'mySocket'];

    /* @ngInject */
    function DashboardController(DashboardFactory, ChatFactory, UserAuthFactory, $state, mySocket) {
        // console.log('DashboardController loaded');

        var _this = this;

        /**
         * Creates a new chat room. Handler for form submission
         *
         * Socket event: Notifies server room was created
         */
        this.createRoom = function(formData) {
            var roomInfo = {
                name: formData.name,
                topic: formData.topic,
                _owner: UserAuthFactory.getUser()._id
            }

            var newRoom = new ChatFactory(roomInfo);

            newRoom.$save()
                .then( function(response) { 
                    mySocket.emit('room_created', { _room: response.content._id }); 
                    _this.userInfo.created_rooms.unshift(response.content);
                    _clearNewRoomForm();
                })
                .catch( function(err) { 
                    console.log('DashboardController:createRoom(error) - ', err); 
                });
        }

        /**
         * User requests to join a room. 
         *
         * Socket event: Requests authorization from the server
         */
        this.loadRoom = function(roomId) {
            console.log('DashboardController:socket(room/auth/req)', roomId);
            mySocket.emit('room/auth/req', {_room: roomId});
        };


        /**
         * Socket listener for room join authorizations
         */
        mySocket.on('room/auth/success', function(roomObj) {
            console.log('DashboardController:socket(room/auth/success) - ', roomObj._room);
            ChatFactory.setOpenRoomId(roomObj._room);
            $state.go('chat');
        });

        /**
         * Clears New Room Form upon submission
         */
        function _clearNewRoomForm() {
            _this.newRoomForm.$setPristine();
            _this.newRoomForm.$setUntouched();
            _this.newRoomForm.formData = '';
        }

        /**
         * Retrieves current user's info to populate dashboard
         */
        var _getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    // console.log('DashboardController:getUserInfo(success)- ', response.user);
                    _this.userInfo = response.user;
                }
            })
        }

        var _getChatRoomsList = function() {
            ChatFactory.get().$promise.then(function(response) {
                _this.roomsList = response.content;
            })
            .catch( function(err) {
                console.log('Error', err);
            });
        }
        
        var _init = (function() {
            _getChatRoomsList();
            _getUserInfo();
        })();
    }
})();