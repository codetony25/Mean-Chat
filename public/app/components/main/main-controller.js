(function() {
    'use strict';

    angular
        .module('meanChat')
        .controller('MainController', MainController);

    MainController.$inject = ['UserAuthFactory', 'MainFactory', 'ChatFactory', 'mySocket', '$state', '$q'];

    function MainController(UserAuthFactory, MainFactory, ChatFactory, mySocket, $state, $q) {
        var _this = this;
        var originatorEvent;

        _this.MF = MainFactory;
        _this.closingRoom = false;

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
            if( ChatFactory.getOpenRoomId() !== roomId ) {
                console.log('DashboardController:socket(room/auth/req)', roomId);
                mySocket.emit('room/auth/req', {_room: roomId});
                return;
            } 

            return console.log('DashboardController denied loadRoom request: Same room');
        };

        /**
         * Socket listener for room join authorizations
         */
        mySocket.on('room/auth/success', function(room) {
            console.log('MainController:socket(room/auth/success)', room);

            var _isRoomInList = function(room) {
                return function(el) {
                    return el._id === room._id;
                }
            };

            if( ! _this.MF.active_rooms.some(_isRoomInList(room)) ) {
                _this.MF.active_rooms.push(room);
            }

            ChatFactory.setOpenRoomId(room._id);

            $state.go('chat', {}, {reload: true});
        });

        this.closeRoom = function(roomId) {
            this.closingRoom = true;

            for(var idx in _this.MF.active_rooms) {
                if(_this.MF.active_rooms[idx]._id === roomId) {
                    
                    console.log('ID being checked, ', _this.MF.active_rooms[idx]._id, ' at index of ', idx);

                    mySocket.emit( 'room/user/exit', {_room: roomId});
                    _this.MF.active_rooms.splice(idx, 1);
                    this.closingRoom = false;

                    if( ChatFactory.getOpenRoomId() === roomId ) {
                        $state.go('dashboard');
                    }
                    ChatFactory.setOpenRoomId = null;

                    return;
                }
            }

            this.closingRoom = false;
        }
    }
})();