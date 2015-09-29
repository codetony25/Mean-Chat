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
        // TO DO: Success response
      }, function(err) {
        _this.registrationErrors = err.data.errors;
      })
    };

    this.userLogin = function(user) {
      var user = new UserAuthFactory(user);
      
      user.$login( function(response) {
        console.log(response);
      }, function(err) {
        _this.loginErrors = err.data.errors;
      });
    }

    this.test = function() {
      console.log( UserAuthFactory.query());
    }
  }
})();