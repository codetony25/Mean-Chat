(function() {
  'use strict';

  angular
    .module('meanChat.dashboard')
    .factory('DashboardFactory', DashboardFactory);

  DashboardFactory.$inject = ['$resource'];

  /* @ngInject */
  function DashboardFactory($resource) {
    var dashboardResource = $resource('/dashboard/:id', { id: '@_id' }, {
      update: { method: 'PUT', isArray: false }
    });

    return dashboardResource;
  }
})();