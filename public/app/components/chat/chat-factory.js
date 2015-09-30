(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .factory('ChatFactory', ChatFactory);

    ChatFactory.$inject = ['$resource'];

    /* @ngInject */
    function ChatFactory($resource) {
        var factory = {};

        return factory;
    }
})();