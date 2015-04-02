'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html',
        resolve: {
        	test: function(AuthService, $state) {
        		AuthService.getLoggedInUser().then(function(user) {
        			if (user && !user.username) $state.go('createUsername');
        		});
        	}
        }
    });
});

app.controller('HomeCtrl', function($scope, AuthService, UsersFactory) {

	UsersFactory.getAllUsers().then(function(users) {
		$scope.users = users;
		users.sort(function(user1, user2) {
			return user2.totalScore - user1.totalScore;
		});
		
		$scope.topFive = [];


		var five = users.slice(0, 5);
			$scope.topFive.push(five);
			$scope.topFive = five;
	});

});
