(function () {
    'use strict';

    angular
        .module('meanChat.chat')
        .factory('MessageFactory', MessageFactory);

    MessageFactory.$inject = ['$resource'];

    /* @ngInject */
    function MessageFactory($resource) {
        console.log('MessageFactory loaded');

        var factory = $resource('/messages/:id', { id: '@_id' }, {
          update: { method: 'PUT', isArray: false },
          query: {
            method: 'GET',
            url: '/messages/q/'
          }
        });

        return factory;
    }
})();