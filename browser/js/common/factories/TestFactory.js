'use strict';
app.factory('TestFactory', function ($http){
	var factory = {};

	factory.submitTest = function (exercise) {
		return $http.post('/api/tests', exercise).then(function(response){
			return response;
		});
	};

	return factory;
}) 