(function() {
  'use strict';

  angular
    .module('meanChat.userAuth')
    .factory('UserAuthFactory', UserAuthFactory);

  UserAuthFactory.$inject = ['$resource', 'SessionFactory', '$http'];

  /* @ngInject */
  function UserAuthFactory($resource, SessionFactory, $http) {
    // console.log('UserAuthFactory loaded');

    var factory = $resource('/users/:_id', { _id: '@_id' }, {
      update: { method: 'PUT', isArray: false },
      login: { method: 'POST', url: '/users/login' },
      logout: { method:'GET', url: '/users/logout' }
    });

    var _user = null;
    var _isLoggedIn = false;

    // Testing in case ngresource is the issue
    factory.leave = function() {
      $http({
        method: 'GET',
        url: '/users/logout'
      }).then(function(response) {
        console.log(response);
      }, function(err) {
        console.log(err);
      });
    }

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
        console.log(_user);
        console.log(SessionFactory.getUser());

        _user = null;
        _isLoggedIn = false;
        SessionFactory.destroyUser();
    }

    function _init() {
        _user = SessionFactory.getUser();
        // console.log('UserAuthFactory:init - ', _user);
        if( _user ) {
            _isLoggedIn = true;
        }
    }
    
    _init();

    return factory;
  };
})();