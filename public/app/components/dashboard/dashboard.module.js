(function() {
    'use strict';

    angular
        .module('meanChat.dashboard', [
            'ui.router',
            'ngResource',
            'btford.socket-io'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                views: {
                    '': {
                        templateUrl: 'app/components/dashboard/dashboard.html',
                        controller: 'DashboardController as Dashboard'
                    },
                    'main@dashboard': {
                        templateUrl: 'app/components/dashboard/dashboard-main.html'
                    },
                    'sidebar@dashboard': {
                        templateUrl: 'app/components/dashboard/dashboard-profile.html'
                    }
                },
                data: {requiresLogin: true }
            });
    } 
})();