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

        var openRoomObj;

        factory.setOpenRoom = function(roomObj) {
            openRoomObj = roomObj;
        }

        factory.getOpenRoom = function() {
            // return openRoomObj;

            return {
                _id: '560ce0f42b817f2c354513a9'
            }
        }

        return factory;
    }
})();