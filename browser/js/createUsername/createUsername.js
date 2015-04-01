app.config(function($stateProvider) {
  $stateProvider.state('createUsername', {
    url: '/create_username',
    controller: 'UsernameCtrl',
    templateUrl: 'js/createUsername/createUsername.html'
  });
});

app.controller('UsernameCtrl', function($scope, AuthService, UsersFactory, $state) {
  $scope.updateUsername = function() {
    if ($scope.newUsernameForm.$invalid) {
      $scope.newUsernameForm.submitted = true;
      $scope.error = 'You need to choose a unique username!';
      return;
    }
    AuthService.getLoggedInUser().then(function(user) {
      $scope.newUsernameForm.submitted = false;
      user.username = $scope.username;
      UsersFactory.updateUser(user);
      $state.go('home');
    });
  };

});

