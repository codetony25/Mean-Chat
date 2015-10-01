(function () {
    'use strict';

    angular
        .module('meanChat', [
            'ui.router',
            'ngMessages',
            'ngMaterial',
            'ngResource',
            'dndLists',
            'meanChat.chat',
            'meanChat.userAuth',
            'meanChat.dashboard',
            'meanChat.test',
            'btford.socket-io'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider, $mdThemingProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo', {
                'default': '900',
                'hue-1': '600',
                'hue-2': '400',
                'hue-3': '100'
        })
        .accentPalette('pink')
        .warnPalette('red');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/', {
                url: '/',
                views: {
                    'main-content': {
                        templateUrl: 'app/components/main/home-page.html',
                        controller: 'MainController as Main'
                    }
                }
            })
    } 

    run.$inject = ['$rootScope', '$state', 'UserAuthFactory'];
    
    function run($rootScope, $state, UserAuthFactory) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if( toState.data && toState.data.requiresLogin && !UserAuthFactory.isLoggedIn() ) {
                console.log('User not logged in. Re-routing to login screen');
                event.preventDefault();
                $state.go('authenticate.login');
            }
        });
    }
})();