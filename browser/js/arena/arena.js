'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('arena', {
        url: '/arena',
        controller: 'ArenaController',
        templateUrl: 'js/arena/arena.html'
    });
});

app.controller('ArenaController', function($scope, RoomFactory, AuthService) {
  AuthService.getLoggedInUser().then(function (user) {
    $scope.user = user;
    $scope.test = RoomFactory.createRoom('exercise', $scope.user);
  });

});
