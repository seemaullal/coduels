'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userCode', {
        url: '/about',
        controller: 'UserCodeCtrl',
        templateUrl: 'js/about/userCode.html'
    });

});

app.controller('UserCodeCtrl', function($scope, AuthService, UsersFactory) {
	AuthService.getLoggedInUser().then(function(archivedUser) {
		UsersFactory.getUser(archivedUser._id).then(function(user) {
			$scope.user = user;
			console.log('this page user', $scope.user);

			$scope.userExercise = [];
			$scope.user.exercises.forEach(function(exercise) {
				$scope.userExercise.push(exercise);
			})

		})
	})
})