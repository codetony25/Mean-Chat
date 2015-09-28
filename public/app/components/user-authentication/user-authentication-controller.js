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
      console.log(user);
      UserAuthFactory.save(user);
    };
  }
})();