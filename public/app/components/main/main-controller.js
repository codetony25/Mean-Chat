(function() {
    'use strict';

    angular
        .module('meanChat')
        .controller('MainController', MainController);

    MainController.$inject = ['UserAuthFactory', 'MainFactory', 'ChatFactory', 'mySocket', '$state'];

    function MainController(UserAuthFactory, MainFactory, ChatFactory, mySocket, $state) {
        var _this = this;
        _this.MF = MainFactory;

        var originatorEvent;

        this.openMenu = function($mdOpenMenu, event) {
            originatorEvent = event;
            $mdOpenMenu(event);
        };

        this.isLoggedIn = function() {
            return UserAuthFactory.isLoggedIn();
        }

        this.logout = function() {
            UserAuthFactory.logout( function(response) {
                if (response.success) {
                    UserAuthFactory.removeUser();
                    _this.MF.active_rooms = [];
                    $state.go('authenticate.login');
                }
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
        mySocket.on('room/auth/success', function(room) {

            if( ! _this.MF.active_rooms.some(_isRoomInList(room)) ) {
                _this.MF.active_rooms.push(room);
            }

            ChatFactory.setOpenRoomId(room._id);

            $state.go('chat');
        });

        var _isRoomInList = function(room) {
            return function(el) {
                return el._id === room._id;
            }
        };
    }
})();