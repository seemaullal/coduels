'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html',
    });
});

app.controller('HomeCtrl', function($scope, AuthService, UsersFactory) {

	UsersFactory.getAllUsers().then(function(users) {
		$scope.users = users;
		console.log('all users', $scope.users);

		$scope.topFive = [];

		var five = users.slice(0, 5);
			$scope.topFive.push(five);
			$scope.topFive = five;
	});

})
