(function() {
    'use strict';

    angular
        .module('meanChat.test', [
            'ui.router',
            'ngResource',
            'btford.socket-io'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('test', {
                url: '/test',
                views: {
                    '': {
                        templateUrl: 'app/components/test-sockets/test.html',
                        controller: 'TestController as Test'
                    }
                },
                data: {requiresLogin: true }
            });
    } 
})();