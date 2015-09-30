(function() {
  'use strict';

  angular
    .module('meanChat.userAuth')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource', 'SessionFactory', '$http'];

  /* @ngInject */
  function UserAuthFactory($resource, SessionFactory, $http) {
    console.log('UserAuthFactory loaded');

    var factory = $resource('/users/:id', { id: '@_id' }, {
      update: { method: 'PUT', isArray: false },
      login: { method: 'POST', url: '/users/login' },
      logout: { method:'POST', url: '/users/logout' }
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
        return _isLoggedIn;
    }

    factory.removeUser = function() {
        _user = null;
        _isLoggedIn = false;
        SessionFactory.destroyUser();
    }

    function _init() {
        _user = SessionFactory.getUser();

        if( _user ) {
            _isLoggedIn = true;
        }
    }
    
    _init();

    return factory;
  };
})();