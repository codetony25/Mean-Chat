(function () {
  'use strict';

  angular
    .module('meanChat', [
      'ui.router',
      'ngMessages',
      'ngMaterial',
      'ngResource',
      'dndLists',
      'luegg.directives',
      'meanChat.home-page',
      'meanChat.chat',
      'meanChat.userAuthentication',
      'meanChat.dashboard',
      'btford.socket-io'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider'];

  /* @ngInject */
  function config($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo', {
        'default': '900',
        'hue-1': '600',
        'hue-2': '400',
        'hue-3': '100'
      })
      .accentPalette('pink')
      .warnPalette('red');

    $urlRouterProvider.otherwise('home');
  } 
})();