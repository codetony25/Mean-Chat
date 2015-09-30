(function () {
  'use strict';

  angular
    .module('meanChat.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardFactory', 'mySocket', 'UserAuthFactory'];

  function DashboardController(DashboardFactory, mySocket, UserAuthFactory) {
    console.log(UserAuthFactory.getUser());
  }
})();