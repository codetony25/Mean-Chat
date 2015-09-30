(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'mySocket', 'ChatFactory'];

    /* @ngInject */
    function DashboardController(DashboardFactory, mySocket, ChatFactory) {
        var _this = this;

        this.getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    _this.userInfo = response.user;
                    console.log(_this.userInfo);
                }
            })
        }

        this.createRoom = function(formData) {
            console.log(formData);
        }
        
        var _init = function _init() {
            _this.getUserInfo();
        }

        _init();
    }
})();