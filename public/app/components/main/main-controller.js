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
            UserAuthFactory.logout( function() {
                UserAuthFactory.removeUser();
            });
        }

        /**
         * User requests to join a room. 
         *
         * Socket event: Requests authorization from the server
         */
        this.loadRoom = function(roomId) {
            // console.log('DashboardController:socket(room/auth/req)', roomId);
            mySocket.emit('room/auth/req', {_room: roomId});
        };

        /**
         * Socket listener for room join authorizations
         */
        mySocket.on('room/auth/success', function(roomObj) {
            console.log(roomObj);
            // console.log('DashboardController:socket(room/auth/success) - ', roomObj._room);
            _this.MF.active_rooms.push(roomObj);
            ChatFactory.setOpenRoomId(roomObj._room);
            $state.go('chat');
        });
    }
})();