(function () {
  'use strict';

  angular
    .module('meanChat.home-page', [
      'ui.router'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/components/home-page/home-page.html',
        controller: 'HomePageController as HomePage'
      })
  } 
})();