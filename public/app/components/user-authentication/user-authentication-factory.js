(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource'];

  /* @ngInject */
  function UserAuthFactory($resource) {
    var userResource = $resource('/users/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });

    userResource.prototype.testFn = function() {

    };

    return userResource;
  };
})();