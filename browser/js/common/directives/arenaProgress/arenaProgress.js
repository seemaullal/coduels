'use strict';
app.directive('arenaProgress', function (){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/arenaProgress/arenaProgress.html',
		link: function (scope){
			if (!scope.passedTests) {scope.passedTests = 0}
			else if (scope.passedTests !== scope.user.passed) {
				console.log("passedTests", scope.passedTests);
				console.log("scope.user.passed", scope.user.passed);
				scope.passedTests = scope.user.passed;
			};
		}
	};
});


// if (arr.length == 6){return []};