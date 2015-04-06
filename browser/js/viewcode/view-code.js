'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('viewCode', {
        url: '/viewCode/:user',
        controller: 'ViewCodeCtrl',
        templateUrl: 'js/viewcode/view-code.html',
        
    });
});

app.controller('ViewCodeCtrl', function($scope, AuthService, UsersFactory, $stateParams, ExerciseFactory) {

	AuthService.getLoggedInUser().then(function(archivedUser) {
		UsersFactory.getUser(archivedUser._id).then(function(user) {
			$scope.user = user;
			UsersFactory.getUser($stateParams.user).then(function(data) {
				$scope.viewUser = data;
				//shared is an array of exercise object that both the current logged in user and the "view user" have both done
				var shared = $scope.viewUser.uniqueChallenges.filter( function (challenge) {
					return _.findIndex($scope.user.uniqueChallenges, {id: challenge._id}) > -1;
				});

				$scope.sharedCode = shared;
				$scope.codeArray = [];
				$scope.sharedCode.forEach(function(exercise) {
					exercise.viewUserObjs = [];
					exercise.viewUserCodeArr = [];

					$scope.viewUser.exercises.forEach(function(viewUserExercise) {
						if(exercise.name === viewUserExercise.exerciseID.name) {
							
							exercise.viewUserObjs.push(viewUserExercise);

							exercise.viewUserCodeArr.push(viewUserExercise.code);

							exercise.viewUserCodeArr = _.compact(exercise.viewUserCodeArr);


							// exercise.viewUserCode.forEach(function(userCode) {
							// 	console.log('userCode', userCode);
							// })

						}
					})
					console.log('shared user code', $scope.sharedCode);
					
				})
				
			});
		});
	});
});


		// });
