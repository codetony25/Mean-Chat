(function () {
  'use strict';

  angular
    .module('meanChat', [
      'ui.router',
      'ngMessages',
      'ngMaterial',
      'meanChat.home-page',
      'meanChat.userAuthentication'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider'];

  function config($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo');

    $urlRouterProvider.otherwise('home');
  } 
})();