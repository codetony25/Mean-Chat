(function() {
    'use strict';

    angular
        .module('meanChat.userAuth')
        .controller('UserAuthController', UserAuthController);

    UserAuthController.$inject = ['UserAuthFactory', '$state', 'mySocket'];

    /* @ngInject */
    function UserAuthController(UserAuthFactory, $state, mySocket) {
        var _this = this;

        this.userRegistration = function(user){
            var newUser = new UserAuthFactory(user);

            newUser.$save( function(response) {
                if(response.state == 'success') {
                    $state.go('authenticate.login');
                }
            }, function(err) {
                _this.registrationErrors = err.data.errors;
            });
        };

        this.userLogin = function(user) {
            var user = new UserAuthFactory(user);

            user.$login( function(response) {
                if(response.state == 'success') { 
                    UserAuthFactory.setUser(response.user);
                    mySocket.emit('user_logged_in', response.user);
                    $state.go('dashboard');
                }
            }, function(err) {
                _this.loginErrors = err.data.errors;
            });
        }
    }
})();