(function () {
  'use strict';

  angular
    .module('meanChat.userAuthentication', [
      'ui.router',
      'ngResource',
      'btford.socket-io'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('authenticate', {
        url: '/authenticate',
        abstract: true,
        templateUrl: 'app/components/user-authentication/authentication.html',
        controller: 'userAuthenticationController as UserAuth'
      })
      .state('authenticate.login', {
        url: '',
        templateUrl: 'app/components/user-authentication/local-account/login.html'
      })
      .state('authenticate.register', {
        url: '/register',
        templateUrl: 'app/components/user-authentication/local-account/registration.html'
      })
  } 
})();