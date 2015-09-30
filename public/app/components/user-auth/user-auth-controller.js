(function() {
    'use strict';

    angular
        .module('meanChat.userAuth')
        .controller('UserAuthController', UserAuthController);

    UserAuthController.$inject = ['UserAuthFactory', '$state'];

    /* @ngInject */
    function UserAuthController(UserAuthFactory, $state) {
        var _this = this;

        this.userRegistration = function(user){
            var newUser = new UserAuthFactory(user);
            console.log('UserAuth controller - userRegistration', newUser);

            newUser.$save( function(response) {
                console.log("here", response);
                if(response.state == 'success') {
                    $state.go('authenticate.login');
                }
            }, function(err) {
                console.log(err);
                _this.registrationErrors = err.data.errors;
            });
        };

        this.userLogin = function(user) {
            var user = new UserAuthFactory(user);
            console.log('UserAuthController - login');

            user.$login( function(response) {
                console.log('here');
                if(response.state == 'success') { 
                    UserAuthFactory.setUser(response.user);
                    $state.go('dashboard');
                }
            }, function(err) {
                _this.loginErrors = err.data.errors;
            });
        }

        this.logout = function() {
            UserAuthFactory.logout( function() {
                UserAuthFactory.removeUser();
            })
        }
    }
})();