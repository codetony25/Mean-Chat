(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory', '$state'];

    /* @ngInject */
    function ChatController(ChatFactory, mySocket, MessageFactory, $state) {
        console.log('ChatController loaded');

        var _this = this;

        this.sendMessage = function(message) {
            mySocket.emit('new_message', {
                _room: _this.openRoomId,
                message: message,
                resource_type: 'Message'
            });
            _clearMessage();
        }

        function _getRoomInfo() {

            ChatFactory.get({id: _this.openRoomId}).$promise.then(function(data) {
                _this._roomInfo = data.content;
                console.log('ChatController:_getRoomInfo success - ', _this._roomInfo);
            })
            .catch(function(err) {
                console.log('ChatController:_getRoomInfo error - ', err);
            });
        }

        function _getMessages() {
            MessageFactory.query({ _room: _this.openRoomId }, function(response) {
                console.log('ChatController:_getMessages success - ', response);
                _this.messages = response.content;
            }, function( err ) {
                console.log('ChatController:_getMessages error - ', err);
            })
        }

        function _clearMessage() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }

        function _init() {
            _this.sidebarTitle = $state.current.data.sidebarTitle;
            _this.openRoomId = ChatFactory.getOpenRoom()._id;
            _getMessages();
            _getRoomInfo();

            mySocket.on('room_' + _this.openRoomId, function(data) {
                _this.messages.push(data);
            });

            mySocket.on('room_' + _this.openRoomId, function(data) {
                _this._roomInfo = data;
            })
        }

        _init();
    }
})();
