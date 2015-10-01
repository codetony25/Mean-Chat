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

        var openRoomObj;

        factory.setOpenRoom = function(roomObj) {
            openRoomObj = roomObj;
        }

        factory.getOpenRoom = function() {
            // return openRoomObj;

            return {
                _id: '560d79491b6577e78d0e01d2'
            }
        }

        return factory;
    }
})();