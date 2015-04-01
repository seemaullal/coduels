app.config(function($stateProvider) {
  $stateProvider.state('createUsername', {
    url: '/create_username',
    controller: 'UsernameCtrl',
    templateUrl: 'js/createUsername/createUsername.html'
  });
});

app.controller('UsernameCtrl', function($scope, AuthService, UsersFactory, $state) {
  $scope.updateUsername = function() {
    AuthService.getLoggedInUser().then(function(user) {
      user.username = $scope.username;
      UsersFactory.updateUser(user);
      $state.go('home');
    });
  };

});

