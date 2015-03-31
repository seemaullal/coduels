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
		$scope.exerciseForm.submitted = false;
	};

	$scope.updateExercise = function(){
		if ($scope.exerciseForm.$invalid) {
			$scope.errMessage = 'You need to fill in all the fields before updating!'
			$scope.exerciseForm.submitted = true;
			return;
		}
		ExerciseFactory.updateExercise($scope.selectedExercise).then ( function (response) {
			$scope.exerciseForm.submitted = false;
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
