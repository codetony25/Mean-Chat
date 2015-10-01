(function () {
	'use strict';

    angular
        .module('meanChat.message')
        .factory('MessageFactory', MessageFactory);

    MessageFactory.$inject = ['$resource'];

    /* @ngInject */
    function MessageFactory($resource) {
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