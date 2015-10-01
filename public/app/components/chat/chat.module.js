(function () {
  'use strict';

  angular
    .module('meanChat.chat', [
      'ui.router'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        abstract: true,
        templateUrl: 'app/components/chat/chat.html',
        controller: 'ChatController as Chat'
      })
      .state('chat.questions', {
        url: '',
        templateUrl: 'app/components/chat/partials/user-questions.html'
      })
      .state('chat.users', {
        url: '',
        templateUrl: 'app/components/chat/partials/user-list.html'
      })
      .state('chat.people', {
        url: '',
        template: '<h3 class="md-subhead">Favorites</h3>'
      })
      .state('chat.visits', {
        url: '',
        template: '<h3 class="md-subhead">Recent Visits</h3>'
      })
      .state('chat.friends', {
        url: '',
        template: '<h3 class="md-subhead">Friends</h3>'
      })
  } 
})();