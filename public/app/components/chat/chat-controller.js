(function() {
    'use strict';

  angular
    .module('meanChat.chat')
    .controller('ChatController', ChatController)
    .directive('dndColor', questionColor)
    .directive('dragOverlay', overlayDrag);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory', '$state', '$q'];



    /* @ngInject */
    function ChatController(ChatFactory, mySocket, MessageFactory, $state, $q) {
        // console.log('ChatController loaded');

        var _this = this;

        /**
         * When user submits message, emit to server
         */
        this.sendMessage = function(message) {

            mySocket.emit('message/new', {
                _room: ChatFactory.getOpenRoomId(),
                message: message,
                resource_type: 'Text'
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


        /**
         * Initialize socket listners for active room
         */
        var _initializeListeners = function() {
            var listenerBase = 'room/' + ChatFactory.getOpenRoomId();

            // listens for messages & updates
            mySocket.on(listenerBase + '/message', function(data) {
                console.log(data);
                _this.messages.push(data);
            });

            // listens for user joins & updates
            mySocket.on(listenerBase + '/user/joined', function(userData) {
                _this._usersList.push(userData);
            });

            // listens for user exit & removes from list
            mySocket.on(listenerBase + '/user/exited', function(userData) {

            });
        }


        /**
         * Clears message form upon submit
         */
        var _clearMessage = function() {
            _this.messageForm.$setPristine();
            _this.userMessage = '';
        }


        var _init = (function() {
            // _this.sidebarTitle = $state.current.data.sidebarTitle;
            // Promises
            var getRoomInfo = ChatFactory.get({ _id: ChatFactory.getOpenRoomId() }).$promise;
            var getMessages = MessageFactory.query({ _room: ChatFactory.getOpenRoomId() }).$promise;
            var getChatRoomsList = ChatFactory.get().$promise;
            
            $q.all([getRoomInfo, getMessages, getChatRoomsList])
                .then(function(response) {
                    // Room Info
                    _this._usersList = response[0].content._users;
                    _this._roomInfo = response[0].content;

                    // Messages
                    _this.messages = response[1].content;

                    // Roomslist
                    _this.roomsList = response[2].content;

                    _initializeListeners();

                    // notify server user has joined the room
                    mySocket.emit('room/user/join', { _room: ChatFactory.getOpenRoomId() })
                })
                .catch(function(err) {
                    console.log('Chat room initialization failed: ', err);
                    $state.go('dashboard');
                });
        })();
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
