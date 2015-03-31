
'use strict';
app.factory('ExerciseFactory', function ($http){
	var factory = {};

	factory.submitExercise = function (exercise) {
		return $http.post('/api/exercises', exercise).then(function (response){
			return response;
		});
	};

	factory.getExercises = function () {
		return $http.get('/api/exercises').then(function (response){
			return response.data;
		});
	};

	factory.updateExercise = function (exercise) {
		return $http.put('/api/exercises', exercise).then(function (response){
			return response.data;
		});
	};

	factory.deleteExercise = function (exercise) {
		return $http.delete('/api/exercises', exercise).then(function (response){
			return response.data;
		});
	};

	return factory;
});
