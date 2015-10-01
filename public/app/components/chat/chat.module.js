(function () {
    'use strict';

    angular
        .module('meanChat.chat', [
            'ui.router'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('chat', {
                url: '/chat',
                views: {
                    '@': {
                        templateUrl: 'app/components/shared/main-layout.html',
                        controller: 'ChatController as Chat'
                    },
                    'content@chat': {
                        templateUrl: 'app/components/chat/main/chat-main.html'
                    },
                    'sidebar-content@chat': {
                        templateUrl: 'app/components/chat/sidebar/users-list.html'
                    },
                    'sidebar-nav@chat': {
                        templateUrl: 'app/components/chat/sidebar/sidebar-nav.html'
                    }
                },
                data: { 
                    requiresLogin: true,
                    sidebarTitle: 'Users List'
                }
            })
            .state('chat.users-list', {
                views: {
                    'sidebar-content@chat': {
                        templateUrl: 'app/components/chat/sidebar/users-list.html'
                    }
                }
            })
            .state('chat.resources-list', {
                views: {
                    'sidebar-content@chat': {
                    templateUrl: 'app/components/chat/sidebar/resources-list.html'                    
                  }
                }
            })
            ;
    } 
})();