(function() {
    'use strict';

    angular
        .module('meanChat')
        .factory('SessionFactory', SessionFactory);

    SessionFactory.$inject = ['$window'];

    /* @ngInject */
    function SessionFactory($window) {
        console.log('SessionFactory loaded');

        var factory = {};
        var _key = 'userInfo';

        factory.storeUser = function(userInfo) {
            $window.sessionStorage[_key] = JSON.stringify(userInfo);
        }

        factory.getUser = function() {
            if (!$window.sessionStorage[_key]) {
                return null;
            }
            
            return JSON.parse($window.sessionStorage[_key]);
        }

        factory.destroyUser = function() {
            $window.sessionStorage[_key] = null;
        }

        return factory;
    }

})();