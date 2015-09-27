(function () {
  'use strict';

  angular
    .module('meanChat.userAuthentication', [
      'ui.router'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('authenticate', {
        url: '/authenticate',
        templateUrl: 'app/components/user-authentication/authentication.html',
        controller: 'userAuthenticationController as UserAuth'
      })
  } 
})();