(function() {
    'use strict';

    angular
        .module('meanChat')
        .factory('SessionFactory', SessionFactory);

    SessionFactory.$inject = ['$window'];

    /* @ngInject */
    function SessionFactory($window) {
        var factory = {};

        // Instantiate data when factory is loaded
        // factory._user = JSON.parse($window.getItem('session.user'));

        return factory;
    }

})();