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
                    '@': {
                        templateUrl: 'app/components/dashboard/dashboard-layout.html',
                        controller: 'DashboardController as Dashboard'
                    },
                    'content@dashboard': {
                        templateUrl: 'app/components/dashboard/main/dashboard-main.html'
                    },
                    'sidebar@dashboard': {
                        templateUrl: 'app/components/dashboard/sidebar/layout.html'
                    },
                    'sidebar-content@dashboard': {
                        templateUrl: 'app/components/dashboard/sidebar/rooms/rooms-search.html'
                    },
                    'sidebar-nav@dashboard': {
                        templateUrl: 'app/components/dashboard/sidebar/rooms/sidebar-nav.html'
                    }
                },
                data: {requiresLogin: true }
            })
            .state('dashboard.sidebar', {
                views: {
                    'sidebar@dashboard': {
                        templateUrl: 'app/components/dashboard/sidebar/layout.html'
                    }
                }
            })
            .state('dashboard.sidebar.profile', {
                views: {
                    'sidebar-content@dashboard.sidebar': {
                        templateUrl: 'app/components/dashboard/sidebar/profile/profile.html'
                    },'sidebar-nav@dashboard.sidebar': {
                        templateUrl: 'app/components/dashboard/sidebar/profile/sidebar-nav.html'
                    }
                }
            })
            .state('dashboard.sidebar.rooms', {
                views: {
                    'sidebar-content@dashboard.sidebar': {
                        templateUrl: 'app/components/dashboard/sidebar/rooms/rooms-search.html'
                    },
                    'sidebar-nav@dashboard.sidebar': {
                        templateUrl: 'app/components/dashboard/sidebar/rooms/sidebar-nav.html'
                    }
                }
            });
    } 
})();