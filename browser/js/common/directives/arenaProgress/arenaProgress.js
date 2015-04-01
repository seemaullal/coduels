'use strict';
app.directive('arenaProgress', function (){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/arenaProgress/arenaProgress.html',
		scope: {
			user: '=user'
		}
		link: function (scope){
			scope.passedTests = user.passed;
			console.log("passed tests", scope.passedTests);
		}
	};
});


// if (arr.length == 6){return []};