(function () {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardFactory', 'ChatFactory', 'UserAuthFactory'];

    /* @ngInject */
    function DashboardController(DashboardFactory, ChatFactory, UserAuthFactory) {
        var _this = this;

        this.getUserInfo = function() {
            DashboardFactory.fetchUserInfo( function(response) {
                if(response.state == 'success') {
                    _this.userInfo = response.user;
                }
            })
        }

        this.createRoom = function(formData) {
            var roomInfo = {
                name: formData.name,
                topic: formData.topic,
                _owner: UserAuthFactory.getUser()._id
            }

            var newRoom = new ChatFactory(roomInfo);

            newRoom.$save()
                .then( function(response) { 
                    console.log(response); 
                })
                .catch( function(err) { 
                    console.log(err); 
                });
        }
        
        var _init = function _init() {
            _this.getUserInfo();
        }

        _init();
    }
})();