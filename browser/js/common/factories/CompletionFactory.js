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
			return (numUsers-1)*5+difficultyPoints[difficulty];
		}
		else {
			return difficultyPoints[difficulty];
		}
		
	};

	factory.sendCompletion = function (userID, exerciseID, code, difficulty, numUsers, isWinner){
		var score = factory.calculateScore(difficulty, numUsers);
		var isChallenge = true;
		var date = new Date();
		if (numUsers === 1) 
			isChallenge=false;
		var completionObj = {
			exerciseID: exerciseID, 
			code: code, 
			score: score, 
			challenge: isChallenge,
			time: date
		};
		console.log('numUsers', numUsers);
		console.log('completionObj',completionObj);
		return $http.post('/api/users/'+ userID + '/exercises', completionObj).then(function(response){
			return response.data;
		});
	};

	return factory;
});