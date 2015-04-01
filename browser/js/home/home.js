'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html',
        resolve: {
        	test: function(AuthService) {
        		AuthService.getLoggedInUser().then(function(user) {
        			if (!user) console.log('nobody logged in');
        			else if (!user.username) console.log('no username');
        			else console.log('has username', user);
        		});
        	}
        }
    });
});

app.controller('HomeCtrl', function($scope, AuthService, UsersFactory) {

	UsersFactory.getAllUsers().then(function(users) {
		$scope.users = users;
		console.log('all users', $scope.users);

		users.sort(function(user1, user2) {
			return user2.totalScore - user1.totalScore
		})
		
		$scope.topFive = [];


		var five = users.slice(0, 5);
			$scope.topFive.push(five);
			$scope.topFive = five;
	});

})
