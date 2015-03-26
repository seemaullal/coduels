'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('exercises', {
		url: '/exercises',
		controller: 'exercisesCtrl',
		templateUrl: '/js/exercises/exercises.html'
	});
});


app.controller('exercisesCtrl', function($scope, $state, RoomFactory, TestFactory, AuthService) {
	TestFactory.getExercises().then(function(exercises) {
		$scope.exercises = exercises;
	});

	RoomFactory.updateActiveRoomData().then(function(activeRooms) {
		$scope.activeRoomData = activeRooms;
		console.log($scope.activeRoomData);
	});

	$scope.joinRoom = function(roomId) {
		RoomFactory.addUserToRoom($scope.user, roomId);
		AuthService.getLoggedInUser().then(function(user) {
			user.isAuthorized = roomId;
		});
	};

	$scope.makeNewRoom = function(exercise) {
		AuthService.getLoggedInUser().then(function(user) {
			$scope.user = user;
			$scope.roomKey = RoomFactory.createRoom(exercise, $scope.user);
			user.isAuthorized = $scope.roomKey;
			console.log('iosdhfiqohrqihqio user authorized', user);
		});
	};
});
