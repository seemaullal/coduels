'use strict';

app.config(function($stateProvider){
	$stateProvider.state('exercises', {
		url: '/exercises',
		controller: 'exercisesCtrl',
		templateUrl: '/js/exercises/exercises.html'
	});
});


app.controller('exercisesCtrl', function($scope, TestFactory){
		TestFactory.getExercises().then(function (exercises){
			$scope.exercises = exercises;
		});
});