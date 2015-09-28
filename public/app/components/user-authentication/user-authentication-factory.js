(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource'];

  /* @ngInject */
  function UserAuthFactory($resourc) {

  }
})