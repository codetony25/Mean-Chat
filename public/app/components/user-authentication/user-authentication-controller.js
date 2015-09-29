(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .controller('userAuthenticationController', userAuthenticationController);

  userAuthenticationController.$inject = ['UserAuthFactory'];

  /* @ngInject */
  function userAuthenticationController(UserAuthFactory) {
    var _this = this;

    this.userRegistration = function(user){
      var newUser = new UserAuthFactory(user);

      newUser.$save( function(data) {
        console.log('here' + data);
      }, function(err) {
        _this.formErrors = err.errors;
      })
    };

    this.userLogin = function(user) {
      console.log( UserAuthFactory.login(user) );
    }

    this.test = function() {
      console.log( UserAuthFactory.query());
    }
  }
})();