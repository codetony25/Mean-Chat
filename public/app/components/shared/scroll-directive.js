(function() {
    'use strict';

    angular
        .module('meanChat')
        .directive('scrollBottom', scrollBottom)
        .directive('scrollTop', scrollTop);

    function scrollBottom() {
        return {
            restrict: 'A',
            scope: {
                scrollBottom: '='
            },
            link: function(scope, element) {
                scope.$watchCollection('scrollBottom', function(newVal) {
                    if( newVal ) {
                        element[0].scrollTop = element[0].scrollHeight;
                    }
                })
            }
        }
    }

    function scrollTop() {
        return {
            restrict: 'A',
            scope: {
                scrollBottom: '='
            },
            link: function(scope, element) {
                scope.$watchCollection('scrollBottom', function(newVal) {
                    if( newVal ) {
                        element[0].scrollTop = 0;
                    }
                })
            }
        }
    }
})()