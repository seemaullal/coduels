'use strict';

app.config(function($stateProvider){
	$stateProvider.state('challenges', {
		url: '/challenges',
		controller: 'challengesCtrl',
		templateUrl: '/js/challenges/challenges.html'
	});
});


app.controller('challengesCtrl', function($scope, $state, RoomFactory, AuthService){
  AuthService.getLoggedInUser().then(function(user) {
    $scope.user = user;
  });

  $scope.makeNewRoom = function() {
      $scope.roomKey = RoomFactory.createRoom('exercise', $scope.user);
      // $state.go('arena')
      console.log($scope.roomKey);
  };

});
