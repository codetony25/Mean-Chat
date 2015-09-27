(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .controller('userAuthenticationController', userAuthenticationController);

  function userAuthenticationController() {
    var _this = this;

    this.userRegistration = function(user){
      console.log(user);
    }
  }
})();