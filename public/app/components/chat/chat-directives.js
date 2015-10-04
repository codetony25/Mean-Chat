(function() {
    'use strict';

  angular
    .module('meanChat.chat')
    .directive('dndColor', questionColor)
    .directive('dragOverlay', overlayDrag);

     /* @ngInject */
     console.log('Chat Directive Loaded');

	// Question Color Directive
	function questionColor() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				var themeColors = ['#FF5722', '#00BCD4', '#009688', '#FF4081', '#448AFF', '#FF4081', '#388E3C'];
				var randomColor = Math.floor(Math.random() * themeColors.length);
				element.find('div').css('background-color', themeColors[randomColor]);
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