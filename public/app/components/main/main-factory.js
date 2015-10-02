(function() {
    'use strict';

    angular
        .module('meanChat')
        .factory('MainFactory', MainFactory);

    function MainFactory() {
        var factory = {};

        factory.active_rooms = [];

        return factory;
    }
})();