(function () {
  'use strict';

  angular
    .module('meanChat')
    .factory('mySocket', mySocket); 

  mySocket.$inject = ['socketFactory'];

  function mySocket(socketFactory) {
    var myIoSocket = io.connect();

    console.log('in the socket factory');
    
    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  }

})();
