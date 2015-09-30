(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource', 'SessionFactory'];

  /* @ngInject */
  function UserAuthFactory($resource, SessionFactory) {
    var factory = $resource('/users/:id', { id: '@_id' }, {
      update: { method: 'PUT', isArray: false },
      login: { method: 'POST', url: '/users/login' }
    });

    var _user = null;
    var _isLoggedIn = false;

    factory.setUser = function(user) {
        SessionFactory.storeUser(user);
        _user = user;
        _isLoggedIn = true;
    }

    factory.getUser = function() {
        return _user;
    }

    factory.isLoggedIn = function() {
        return this._isLoggedIn;
    }

    function _init() {
        _user = SessionFactory.getUser();
    }

    _init();

    return factory;
  };
})();