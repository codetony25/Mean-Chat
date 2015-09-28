(function() {
  'use strict';

  angular
    .module('meanChat.home-page')
    .controller('HomePageController', HomePageController);

  function HomePageController(mySocket) {
    console.log("HomePage Controller loaded");
  }
})();