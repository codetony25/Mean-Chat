(function() {
  'use strict';

  angular
    .module('meanChat.chat')
    .controller('ChatController', ChatController)
    .directive('dndColor', questionColor)
    .directive('dragOverlay', overlayDrag);

  function ChatController() {
    console.log("Chat Controller loaded"); 

//Dummy Data for chat and chat questions drag and drop

		this.lists = {"chatList": [
		  {
		    "chat": "I am awesome"
		  },
		  {
		    "chat": "Yes, I am."
		  },
		  {
		    "chat": "Team Tony is Awesome!"
		  },
		  {
		    "chat": "I need water."
		  },
		  {
		    "chat": "I want a sandwhich!"
		  },
		  {
		    "chat": "I am awesome"
		  },
		  {
		    "chat": "Yes, I am."
		  },
		  {
		    "chat": "Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome! Team Tony is Awesome!"
		  },
		  {
		    "chat": "I need water."
		  },
		  {
		    "chat": "I want a sandwhich!"
		  }

		], "chatQuestions": [
			 //Chat Questions dragged here
			 {
			 	"chat": "Hello World!"
			 }
		]}

		//Dummy text for users:

		this.addToQuestions = function(item) {
			console.log('From List: ', item);
			this.lists.chatQuestions.push(item);
			console.log('Updated List: ', this.lists.chatQuestions);
		}

		this.removeQuestion = function(item, index) {
			console.log('Item to remove', item);
			this.lists.chatQuestions.splice(index, 1);
			console.log('Updated List: ', this.lists.chatQuestions);
		}

	}

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
