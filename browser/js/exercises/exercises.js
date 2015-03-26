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

	RoomFactory.updateActiveRoomData().then(function (activeRooms){
		$scope.activeRoomData = activeRooms;
	});

	$scope.joinRoom = function (roomId) {
		RoomFactory.addUserToRoom($scope.user, roomId);
		AuthService.getLoggedInUser().then(function(user) {
			user.isAuthorized = roomId;
		});
	};

	$scope.makeNewRoom = function(exercise) {
		 $scope.roomKey = RoomFactory.createRoom(exercise, $scope.user);
		 AuthService.getLoggedInUser().then(function(user) {
		 	user.isAuthorized = $scope.roomKey;
		 });
	};
});
