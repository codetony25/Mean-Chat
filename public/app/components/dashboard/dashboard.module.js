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
            templateUrl: 'app/components/dashboard/dashboard.html',
            controller: 'DashboardController as Dashboard',
            resolve: {
                // auth: ['$q', ]
            }
        });
  } 
})();