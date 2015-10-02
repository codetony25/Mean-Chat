(function() {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['UserAuthFactory'];

    /* @ngInject */
    function DashboardFactory(UserAuthFactory) {
        // console.log('DashboardFactory loaded');

        var factory = {};

        factory.fetchUserInfo = function(callback) {
            UserAuthFactory.get({ _id: UserAuthFactory.getUser()._id }, function(response) {
                return callback(response);
            }, function(err) {
                console.log('DashboardFactory:fetchUserInfo(error) - ', err);
            });
        };

        return factory;
    }
})();