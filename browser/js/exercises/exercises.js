'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('exercises', {
		url: '/exercises',
		controller: 'exercisesCtrl',
		templateUrl: '/js/exercises/exercises.html'
	});
});


app.controller('exercisesCtrl', function($scope, $state, RoomFactory, ExerciseFactory, AuthService, $interval, $rootScope){

	 $rootScope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams ) {
        if (fromState.name === 'exercises') { //cancel interval functions when leaving state
           $interval.cancel(timeout);
			$interval.cancel(timeout2);
        }
    });
	$scope.activeRoomData = [ ];
	ExerciseFactory.getExercises().then(function (exercises){
		$scope.exercises = exercises;
	});

	function updateRoomData() {
		RoomFactory.updateActiveRoomData().then(function (activeRooms){
				console.log('something  happening');
				// if (!$scope.activeRoomData || !$scope.activeRoomData.length) {
				// 	$scope.activeRoomData = activeRooms;
				// }
				// else {
					activeRooms.forEach(function (room) {
						if (_.findIndex($scope.activeRoomData, {roomId: room.roomId}) === -1)
							$scope.activeRoomData.push(room);
					});
				// }
		});
	}



	 var timeout = $interval(updateRoomData, 1000);

	$scope.joinRoom = function (roomId) {
		AuthService.getLoggedInUser().then(function(user) {
			$scope.user = user;
			RoomFactory.addUserToRoom($scope.user, roomId);
			user.isAuthorized = roomId;
		});
	};

	$scope.makeNewRoom = function(exercise) {
		 AuthService.getLoggedInUser().then(function(user) {
		 	$scope.user = user;
		 	$scope.roomKey = RoomFactory.createRoom(exercise, $scope.user);
		 	user.isAuthorized = $scope.roomKey;
		 	$scope.$digest();
		 });
	};

	$scope.makePracticeRoom = function(exercise) {
		AuthService.getLoggedInUser().then(function(user) {
		 	$scope.roomKey = RoomFactory.createPracticeRoom(exercise, user);
		 	user.isAuthorized = $scope.roomKey;
		 	clearInterval(timeout);
		 });
	};

	function countDown() {
		$scope.activeRoomData.forEach(function (room,index) {
			room.timeUntilClose = Math.max(0, room.gameStartTime - Date.now());
	  		if (room.gameStartTime <= Date.now() ) {
	   	 		$scope.activeRoomData.splice(index,1);
	  		}

		})
	}

	$scope.isOpen = true;

	var timeout2 = $interval(countDown, 1000);

});
