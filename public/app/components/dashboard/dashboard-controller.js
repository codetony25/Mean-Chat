(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'mySocket'];

    /* @ngInject */
    function DashboardController(DashboardFactory, mySocket) {
        var _this = this;

        this.getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    _this.userInfo = response.user;
                }
            })
        }

        var _init = function _init() {
            _this.getUserInfo();
        }

        _init();
    }
})();