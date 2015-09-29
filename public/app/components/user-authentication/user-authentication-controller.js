(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .controller('userAuthenticationController', userAuthenticationController);

  userAuthenticationController.$inject = ['UserAuthFactory', 'mySocket', '$state'];

  /* @ngInject */
  function userAuthenticationController(UserAuthFactory, mySocket, $state) {
    var _this = this;

    this.userRegistration = function(user){
      var newUser = new UserAuthFactory(user);

      newUser.$save( function(data) {
        if(data.success) {
          $state.go('dashboard');
        }
        
      }, function(err) {
        _this.registrationErrors = err.data.errors;
      })
    };

    this.userLogin = function(user) {
      var user = new UserAuthFactory(user);
      
      user.$login( function(response) {
        console.log(response);
        mySocket.emit('testevent');
      }, function(err) {
        _this.loginErrors = err.data.errors;
      });
    }

  }
})();