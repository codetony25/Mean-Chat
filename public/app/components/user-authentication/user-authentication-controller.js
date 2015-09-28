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
      var result = UserAuthFactory.save(user);
      console.log(result);
    };

    this.userLogin = function(user) {
      console.log( UserAuthFactory.login(user) );
    }

    this.test = function() {
      console.log( UserAuthFactory.query());
    }
  }
})();