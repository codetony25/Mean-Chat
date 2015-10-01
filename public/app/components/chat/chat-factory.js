(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .factory('ChatFactory', ChatFactory);

    ChatFactory.$inject = ['$resource'];

    /* @ngInject */
    function ChatFactory($resource) {
        var factory = $resource('/rooms/:id', { id: '@_id' }, {
          update: { method: 'PUT', isArray: false }
        });

        var openRoomId;

        factory.setOpenRoom = function(roomId) {
            openRoomId = roomId;
        }

        return factory;
    }
})();