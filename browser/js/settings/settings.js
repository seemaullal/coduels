'use strict';

app.config(function($stateProvider){
	$stateProvider.state('settings', {
		url: '/settings',
		controller: 'settingsCtrl',
		templateUrl: '/js/settings/settings.html'
	});
});


app.controller('settingsCtrl', function($scope, ExerciseFactory, $modal){
	ExerciseFactory.getExercises().then( function (exercises) {
		$scope.exercises = exercises;
		console.log(exercises);
	});

	$scope.updateExercise = function(){
		$scope.selectedExercise = {};		
	};
});
