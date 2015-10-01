(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'ChatFactory', 'UserAuthFactory', '$state', 'mySocket'];

    /* @ngInject */
    function DashboardController(DashboardFactory, ChatFactory, UserAuthFactory, $state, mySocket) {
        console.log('DashboardController loaded');

        var _this = this;

        function _getUserInfo() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    console.log('DashboardController:getUserInfo(success)- ', response.user);
                    _this.userInfo = response.user;
                }
            })
        }

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
         * Allows user to join a room.
         *
         * Socket event: Requests authorization from the server
         */
        this.loadRoom = function(roomId) {
            console.log('DashboardController:socket(join_room)', roomId);
            mySocket.emit('room/auth/req', {_room: roomId});
        };


        /**
         * Socket listener for room join authorizations
         */
        mySocket.on('room/auth/success', function(roomId) {
            console.log('DashboardController:socket(joined_room) -', roomId);
            ChatFactory.setOpenRoom(roomId);
            $state.go('chat');
        });

        function _clearNewRoomForm() {
            _this.newRoomForm.$setPristine();
            _this.newRoomForm.$setUntouched();
            _this.newRoomForm.formData = '';
        }
        
        var _init = function _init() {
            _this.getUserInfo();
        }

        _init();
    }
})();