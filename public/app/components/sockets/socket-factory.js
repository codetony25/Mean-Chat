(function () {
    'use strict';

    angular
        .module('meanChat')
        .factory('mySocket', mySocket); 

    mySocket.$inject = ['socketFactory'];

    /* @ngInject */
    function mySocket(socketFactory) {
        console.log('socketFactory loaded');
        var myIoSocket = io.connect();

        mySocket = socketFactory({
            ioSocket: myIoSocket
        });

        

    return mySocket;
    }

})();
