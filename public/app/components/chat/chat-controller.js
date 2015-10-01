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
                _room: ChatFactory.getOpenRoomId(),
                message: message,
                resource_type: 'Text'
            });
            _clearMessage();
        }

        /**
         * [_getRoomInfo description]
         */
        var _getRoomInfo = function() {
            ChatFactory.get({ _id: ChatFactory.getOpenRoomId() }).$promise.then(function(data) {
                _this._usersList = data.content._users;
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
            var listenerBase = 'room/' + _this.openRoomId;

            // listens for messages & updates
            mySocket.on(listenerBase + '/message', function(data) {
                _this.messages.push(data);
            });

            // listens for user joins & updates
            mySocket.on(listenerBase + '/user/joined', function(userData) {
                _this._usersList.push(userData);
            });

            // listens for user exit & removes from list
            mySocket.on(listenerBase + '/user/exited', function(userData) {

            });
        }

        /**
         * 
         */
        var _getMessages = function() {
            MessageFactory.query({ _room: ChatFactory.getOpenRoomId() }, function(response) {
                console.log('ChatController:_getMessages success - ', response);
                _this.messages = response.content;
            }, function( err ) {
                console.log('ChatController:_getMessages error - ', err);
            })
        }

        /**
         * Clears message form upon submit
         */
        var _clearMessage = function() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }

        var _init = function() {
            // _this.sidebarTitle = $state.current.data.sidebarTitle;
            _getMessages();
            _getRoomInfo();
            _initializeListeners();

            // notify server user has joined the room
            mySocket.emit('room/user/join', { _room: ChatFactory.getOpenRoomId() })
        }

        /**
         * 
         */
        _init();
    }
})();
