(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'ChatFactory', 'UserAuthFactory', '$state', 'mySocket'];

    /* @ngInject */
    function DashboardController(DashboardFactory, ChatFactory, UserAuthFactory, $state, mySocket) {
        var _this = this;

        mySocket.on('joined_room', function(roomObj) {
            console.log('Socket listener(joined_room):', roomObj);
            ChatFactory.setOpenRoom(roomObj);
            $state.go('chat');
        })

        this.getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    console.log('On Dashboard load: ', response.user);
                    _this.userInfo = response.user;
                }
            })
        }

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
                    _this.userInfo.created_rooms.push(response.content);
                    _clearNewRoomForm();
                })
                .catch( function(err) { 
                    console.log('Err:', err); 
                });
        }

        this.loadRoom = function(roomId) {
            console.log('Socket emit (join_room)', roomId);
            mySocket.emit('join_room', {_room: roomId});
        }

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