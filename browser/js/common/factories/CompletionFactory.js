'use strict';
app.factory('CompletionFactory', function ($http){
	var factory = {};

	factory.calculateScore = function (difficulty, numUsers) {
		var difficultyPoints = {
			Easy: 10,
			Medium: 20,
			Hard: 30
		};
		return numUsers*5+difficultyPoints[difficulty];
	};

	factory.sendCompletion = function (userID, exerciseID, code, difficulty, numUsers){
		var score = factory.calculateScore(difficulty, numUsers);
		var completionObj = {
			exerciseID: exerciseID, 
			code: code, 
			score: score, 
			challenge: true
		};
		return $http.post('/api/users/exercises'+userID, completionObj).then(function(response){
			return response.data;
		});
	};

	return factory;
});