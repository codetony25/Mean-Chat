(function() {
    'use strict';

  angular
    .module('meanChat.chat')
    .controller('ChatController', ChatController)
    .directive('dndColor', questionColor)
    .directive('dragOverlay', overlayDrag);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory', '$state'];



    /* @ngInject */
    function ChatController(ChatFactory, mySocket, MessageFactory, $state) {
        console.log('ChatController loaded');

        var _this = this;

        this.sendMessage = function(message) {
            mySocket.emit('new_message', {
                _room: _this.openRoomId,
                message: message,
                resource_type: 'Message'
            });
            _clearMessage();
        }


        //Dummy Data to add a question
		this.chatQuestions = [
			//Chat Questions dragged here
				{
					"username" : "The great Tony",
				 	"message" : "Hello World!"
				}
			]

		//Adds a question to our dummy data for questions
		this.addToQuestions = function(message) {
			this.chatQuestions.push(message);
		}

		//Removes a question if the trash can is clicked
		this.removeQuestion = function(message, index) {
			this.chatQuestions.splice(index, 1);
		}

        function _getRoomInfo() {

            ChatFactory.get({id: _this.openRoomId}).$promise.then(function(data) {
                _this._roomInfo = data.content;
                console.log('ChatController:_getRoomInfo success - ', _this._roomInfo);
            })
            .catch(function(err) {
                console.log('ChatController:_getRoomInfo error - ', err);
            });
        }

        function _getMessages() {
            MessageFactory.query({ _room: _this.openRoomId }, function(response) {
                console.log('ChatController:_getMessages success - ', response);
                _this.messages = response.content;
            }, function( err ) {
                console.log('ChatController:_getMessages error - ', err);
            })
        }

        function _clearMessage() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }

        function _init() {
            _this.sidebarTitle = $state.current.data.sidebarTitle;
            _this.openRoomId = ChatFactory.getOpenRoom()._id;
            _getMessages();
            _getRoomInfo();

            mySocket.on('room_' + _this.openRoomId, function(data) {
                _this.messages.push(data);
            });

            mySocket.on('room_' + _this.openRoomId, function(data) {
                _this._roomInfo = data;
            })
        }


        _init();
    }



    //Remember to put directives in their own files!

	//Question Color Directive
	function questionColor() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				var themeColors = ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];
				var randomColor = Math.floor(Math.random() * themeColors.length);
				element.css('background-color', themeColors[randomColor]);
			},
		}
	}

	//Drag Overlay Directive
	function overlayDrag() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				element.on('dragstart', function() {
					var overlay = document.getElementById("addOverlay");
					var blurry = document.getElementById("blurme");
					overlay.classList.remove("hidden");
					overlay.className = overlay.className + " questionOverlay";
					blurry.className = blurry.className + " blur";
					element.on('dragend', function() {
						overlay.classList.remove("questionOverlay");
						blurry.classList.remove("blur");
						overlay.className = overlay.className + " hidden";
					})
				})
			}
		}
	}



})();
