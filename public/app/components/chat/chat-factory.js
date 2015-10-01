(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .factory('ChatFactory', ChatFactory);

    ChatFactory.$inject = ['$resource'];

    /* @ngInject */
    function ChatFactory($resource) {
        console.log('ChatFactory loaded');

        var factory = $resource('/rooms/:id', { id: '@_id' }, {
            update: { method: 'PUT', isArray: false }
        });

        var roomId;

        factory.setOpenRoomId = function(roomId) {
            roomId = roomObj;
        }

        factory.getOpenRoomId = function() {
            var roomId = '560ce0f42b817f2c354513a9'

            return roomId;
        }

        return factory;
    }
})();