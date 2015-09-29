(function () {
  'use strict';

  angular
    .module('meanChat', [
      'ui.router',
      'ngMessages',
      'ngMaterial',
      'ngResource',
      'meanChat.home-page',
      'meanChat.userAuthentication',
      'btford.socket-io'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider'];

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('pink')
      .warnPalette('red');

    $urlRouterProvider.otherwise('home');
  } 
})();