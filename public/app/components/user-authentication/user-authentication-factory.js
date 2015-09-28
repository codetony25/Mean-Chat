(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource', 'mySocket'];

  /* @ngInject */
  function UserAuthFactory($resource, mySocket) {
    var userResource = $resource('/users/:id', { id: '@_id' }, {
      update: { method: 'PUT', isArray: false },
      login: { method: 'POST', url: '/users/login' }
    });

    userResource.prototype.testFn = function() {

    };

    return userResource;
  };
})();