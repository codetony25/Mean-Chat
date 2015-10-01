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

        /**
         * When user submits message, emit to server
         */
        this.sendMessage = function(message) {
            mySocket.emit('message/new', {
                _room: _this.openRoomId,
                message: message,
                resource_type: 'Text'
            });
            _clearMessage();
        }

        var _init = function() {
            // _this.sidebarTitle = $state.current.data.sidebarTitle;
            _this.openRoomId = ChatFactory.getOpenRoomId();
            _getMessages();
            _getRoomInfo();
            _initializeListeners();            
        }

        /**
         * [_getRoomInfo description]
         */
        var _getRoomInfo = function() {
            ChatFactory.get({id: _this.openRoomId}).$promise.then(function(data) {
                _this._roomInfo = data.content;
                console.log('ChatController:_getRoomInfo success - ', _this._roomInfo);
            })
            .catch(function(err) {
                console.log('ChatController:_getRoomInfo error - ', err);
            });
        }

        /**
         * Initialize socket listners for active room
         */
        var _initializeListeners = function() {
            mySocket.on('room/' + _this.openRoomId +'/message', function(data) {
                _this.messages.push(data);
            });
        }

        /**
         * [_getMessages description]
         */
        var _getMessages = function() {
            MessageFactory.query({ _room: _this.openRoomId }, function(response) {
                console.log('ChatController:_getMessages success - ', response);
                _this.messages = response.content;
            }, function( err ) {
                console.log('ChatController:_getMessages error - ', err);
            })
        }

        /**
         * [_clearMessage description]
         */
        var _clearMessage = function() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }

        /**
         * 
         */
        _init();
    }
})();
