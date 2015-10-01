(function() {
  'use strict';

  angular
    .module('meanChat.home-page')
    .controller('HomePageController', HomePageController);

  // HomePageController.$inject = ['mySocket'];
  
  function HomePageController() {
    console.log("HomePage Controller loaded");
  }
})(); 