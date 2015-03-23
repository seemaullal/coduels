'use strict';

app.config(function($stateProvider){
	$stateProvider.state('exercises', {
		url: '/exercises',
		controller: 'exercisesCtrl',
		templateUrl: '/js/exercises/exercises.html'
	});
});


app.controller('exercisesCtrl', function($scope, $state, RoomFactory, TestFactory, AuthService){
		TestFactory.getExercises().then(function (exercises){
			$scope.exercises = exercises;
		});

    AuthService.getLoggedInUser().then(function(user) {
      $scope.user = user;
    });

  $scope.makeNewRoom = function(exercise) {
    $scope.roomKey = RoomFactory.createRoom(exercise, $scope.user);
  };

});
