(function() {
  'use strict';

  angular
    .module('meanChat.userAuthentication')
    .directive('ngEquals', ngEquals);

  function ngEquals() {
      var directive = {
        restrict: 'A',
        require: 'ngModel',
        scope: { 
          original: '=ngEquals' 
        },
        link: function(scope, elm, attrs, ngModel) {
          
          ngModel.$parsers.unshift(function(value) {
            ngModel.$setValidity('equals', scope.original === value);
            return value;
          })
        }
      }

      return directive;
  }
})();