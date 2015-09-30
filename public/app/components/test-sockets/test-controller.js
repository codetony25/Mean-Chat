(function () {
  'use strict';

  angular
    .module('meanChat.test')
    .controller('TestController', TestController);

  TestController.$inject = ['DashboardFactory', 'mySocket'];

  function TestController(DashboardFactory, mySocket) {
    console.log('in DashCtrl');
    mySocket.emit('leave_room', {
    	_room: '560ae3776c83c0004e8c637d',
    	message: '[b]Some newest text[/b]',
    	resource_type: 'Text'
    });

	mySocket.emit('msg_vote', {
		_room: '560ae3776c83c0004e8c637d',
		_message: '560c0786ff77ba2c431700a3',
		vote: 'up'
	});

    mySocket.on('room_560ae3776c83c0004e8c637d', function(data) {
    	console.log(data);
    });

    mySocket.on('user_changed', function(data) {
    	console.log(data);
    });
  }
})();