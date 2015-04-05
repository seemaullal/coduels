'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userCode', {
        url: '/about/:challenge', 
        controller: 'UserCodeCtrl',
        // params: [ 'chllenge'],
        templateUrl: 'js/about/userCode.html'
        // params: ['challenge']
        // data: {'challenge': challenge}
    });

});

app.controller('UserCodeCtrl', function($scope, AuthService, UsersFactory, ExerciseFactory, $stateParams) {
	$scope.exerciseName = $stateParams.challenge;
	AuthService.getLoggedInUser().then(function(archivedUser) {
		UsersFactory.getUser(archivedUser._id).then(function(user) {
			$scope.user = user;

			$scope.userExercise = [];

			$scope.user.exercises.forEach(function(exercise) {
				$scope.userExercise.push(exercise);
			});

			$scope.userExercise.sort(function(obj1, obj2) {
				return new Date(obj2.time) - new Date(obj1.time);
			});

			ExerciseFactory.getExercises().then(function(data) {
				$scope.userExercises = [];
				var exercises = _.pluck(data, "_id");

				$scope.user.uniqueChallenges.forEach(function(exercise) {
					var userExercises = {};
					var i = exercises.indexOf(exercise._id);
					if(i === -1) {
						// console.log('No exercises completed');
					} else {
						userExercises = data[i];
						userExercises.selected = userExercises.name ===$scope.exerciseName;
						userExercises.allCode = [];

						$scope.userExercise.forEach(function(userCode) {
							if(exercise.name === userCode.exerciseID.name){
								userExercises.allCode.push(userCode);	
							}
						});

						$scope.userExercises.push(userExercises);
					}
				});
			});
		});
	});
});