'use strict';

app.config(function($stateProvider){
	$stateProvider.state('settings', {
		url: '/settings',
		controller: 'settingsCtrl',
		templateUrl: '/js/settings/settings.html'
	});
});


app.controller('settingsCtrl', function($scope, ExerciseFactory, $timeout){
	ExerciseFactory.getExercises().then( function (exercises) {
		$scope.exercises = exercises;
		console.log(exercises);
	});


	$scope.pickExercise = function() {

	};

	$scope.updateExercise = function(){
		ExerciseFactory.updateExercise($scope.selectedExercise).then ( function (response) {
			console.log('response',response);
			$scope.success = 'Test successfully added';
			$timeout(function() {
				$scope.success = null;
			}, 5000);
			$scope.exercise = {};
			$scope.selectedExercise = "";
			ExerciseFactory.getExercises().then( function (exercises) {
				$scope.exercises = exercises; //update exercise list with updated exercises
				console.log(exercises);
			});		
		});
	};
});
