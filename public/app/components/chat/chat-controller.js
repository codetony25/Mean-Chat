(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory'];

    /* @ngInject */
    function ChatController(ChatFactory, mySocket, MessageFactory) {
        var _this = this;

        this.sendMessage = function(message) {
            mySocket.emit('new_message', {
                _room: _this.openRoomObj._id,
                message: message,
                resource_type: 'Message'
            });
            _clearMessage();
        }

        function _getRoomInfo() {

            ChatFactory.get({id: _this.openRoomObj._id})
                .$promise.then(function(data) {
                _this._roomInfo = data.content;
            })
            .catch(function(err) {
                console.log('ChatController _getRoomInfo error: ', err);
            });
        }

        function _getMessages() {
            MessageFactory.query({ _room: _this.openRoomObj._id }, function(response) {
                console.log('ChatController _getMessages success: ', response);
                _this.messages = response.content;
            }, function( err ) {
                console.log('ChatController _getMessages error: ', err);
            })
        }

        function _clearMessage() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }

        function _init() {
            _this.openRoomObj = ChatFactory.getOpenRoom();
            _getMessages();
            _getRoomInfo();

            mySocket.on('room_' + _this.openRoomObj._id, function(data) {
                _this.messages.push(data);
                console.log(_this.messages);
            });
        }

        _init();
    }
})();
