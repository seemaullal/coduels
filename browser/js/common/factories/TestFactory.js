'use strict';
app.factory('TestFactory', function ($http){
	var factory = {};

	factory.submitTest = function (exercise) {
		return $http.post('/api/tests', exercise).then(function (response){
			return response;
		});
	};

	factory.getExercises = function () {
		return $http.get('/api/exercises').then(function (response){
			return response.data;
		});
	};

	return factory;
});