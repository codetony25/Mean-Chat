(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .controller('userAuthenticationController', userAuthenticationController);

  function userAuthenticationController() {
    console.log("UserLogin Controller Loaded");
  }
})();