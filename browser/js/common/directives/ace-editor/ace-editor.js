'use strict';
app.directive('aceEditor', function (AuthService) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/ace-editor/ace-editor.html',
        link: function(scope) {

            var userId;

            AuthService.getLoggedInUser().then(function (user) {
                userId = user._id;
            });
        	scope.keyCodeEvents = [13,32,186,8,46,9];

        	scope.onKeyPress = function($event) {
        		if(scope.keyCodeEvents.indexOf($event.keyCode) > -1 || scope.start) {
                    scope.userCode = scope.aceEditor.getDocument().getValue();
                    document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;
        		}
        	};

        }
    };
});
