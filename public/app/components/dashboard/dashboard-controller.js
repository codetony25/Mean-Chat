(function () {
  'use strict';

  angular
    .module('meanChat.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardFactory', 'mySocket'];

  function DashboardController(DashboardFactory, mySocket) {
    console.log('in DashCtrl');
  }
})();