'use strict';
app.directive('aceEditor', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/ace-editor/ace-editor.html',
        link: function(scope) {
        	
        	var keyCodeEvents = [13,32,186,8,46,9];
        	scope.onKeyPress = function($event) {
        		if(keyCodeEvents.indexOf($event.keyCode) > -1) {
        			console.log('something')
        		}
        	}

        }
    };
});