'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userCode', {
        url: '/about',
        controller: 'UserCodeCtrl',
        templateUrl: 'js/about/userCode.html'
    });

});

app.controller('UserCodeCtrl', function($scope, AuthService, UsersFactory, TestFactory) {
	AuthService.getLoggedInUser().then(function(archivedUser) {
		UsersFactory.getUser(archivedUser._id).then(function(user) {
			$scope.user = user;

			$scope.userExercise = [];
			$scope.user.exercises.forEach(function(exercise) {
				$scope.userExercise.push(exercise);
			})
			console.log('userExercise', $scope.userExercise);

			TestFactory.getExercises().then(function(data) {
				$scope.userExercises = [];
				var exercises = _.pluck(data, "_id");

				$scope.user.uniqueChallenges.forEach(function(exercise) {
					var userExercises = {};
					var i = exercises.indexOf(exercise._id);
					if(i === -1) {
						console.log('No exercises completed');
					} else {
						userExercises = data[i];
						$scope.userExercises.push(userExercises);
						console.log('ANYTHING?', $scope.userExercises);
					}
				})
			})

		})
	})
})