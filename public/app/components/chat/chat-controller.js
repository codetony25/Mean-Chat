(function() {
    'use strict';

    angular
        .module('meanChat.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['ChatFactory', 'mySocket'];

    /* @ngInject */
    function ChatController(ChatFactory, mySocket) {
        console.log("Chat Controller loaded"); 
        
    }
})();
