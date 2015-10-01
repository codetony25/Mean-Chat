(function() {
    'use strict';

  angular
    .module('meanChat.chat')
    .controller('ChatController', ChatController)
    .directive('dndColor', questionColor)
    .directive('dragOverlay', overlayDrag);

    ChatController.$inject = ['ChatFactory', 'mySocket', 'MessageFactory', '$state'];
     /* @ngInject */

     console.log('Chat Directive Loaded');
	//Question Color Directive
	function questionColor() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				var themeColors = ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];
				var randomColor = Math.floor(Math.random() * themeColors.length);
				element.css('background-color', themeColors[randomColor]);
			}
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