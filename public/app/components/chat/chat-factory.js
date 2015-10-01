(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .factory('ChatFactory', ChatFactory);

    ChatFactory.$inject = ['$resource'];

    /* @ngInject */
    function ChatFactory($resource) {
        // console.log('ChatFactory loaded');

        var factory = $resource('/rooms/:_id', { _id: '@_id' }, {
            // get: { cache: true, method: 'get' },
            update: { method: 'PUT', isArray: false }
        });

        var _roomId;

        factory.setOpenRoomId = function(roomId) {
            _roomId = roomId;
        }

        factory.getOpenRoomId = function() {
            return _roomId;
        }

        return factory;
    }
})();