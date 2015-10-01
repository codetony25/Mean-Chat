(function() {
    'use strict';

    angular
        .module('meanChat.dashboard')
        .factory('DashboardFactory', DashboardFactory);

    DashboardFactory.$inject = ['UserAuthFactory'];

    /* @ngInject */
    function DashboardFactory(UserAuthFactory) {
        var factory = {};

        factory.fetchUserInfo = function(callback) {
            var user = UserAuthFactory.getUser();

            UserAuthFactory.get({ id: user._id }, function(response) {
                return callback(response);
            }, function(err) {
                console.log('DashboardFactory Error: ', err);
            });
        };

        return factory;
    }
})();