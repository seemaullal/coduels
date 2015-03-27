'use strict';
app.factory('CompletionFactory', function ($http){
	var factory = {};

	factory.calculateScore = function (difficulty, numUsers, isWinner) {
		var difficultyPoints = {
			Easy: 10,
			Medium: 20,
			Hard: 30
		};
		if (isWinner){
			return numUsers*5+difficultyPoints[difficulty];
		}
		else {
			return difficultyPoints[difficulty];
		}
		
	};

	factory.sendCompletion = function (userID, exerciseID, code, difficulty, numUsers, isWinner){
		var score = factory.calculateScore(difficulty, numUsers);
		var completionObj = {
			exerciseID: exerciseID, 
			code: code, 
			score: score, 
			challenge: true
		};
		return $http.post('/api/users/'+ userID + '/exercises', completionObj).then(function(response){
			return response.data;
		});
	};

	return factory;
});