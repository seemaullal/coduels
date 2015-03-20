'use strict';

app.config(function($stateProvider){
	$stateProvider.state('challenges', {
		url: '/challenges',
		controller: 'challengesCtrl',
		templateUrl: '/js/challenges/challenges.html'
	});
});


app.controller('challengesCtrl', function($scope){

});