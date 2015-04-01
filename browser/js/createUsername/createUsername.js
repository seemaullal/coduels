app.config(function($stateProvider) {
  $stateProvider.state('createUsername', {
    url: '/create_username',
    controller: 'UsernameCtrl',
    templateUrl: 'js/createUsername/createUsername.html'
  });
});

app.controller('UsernameCtrl', function($scope) {
  $scope.updateUsername = function() {
    console.log($scope.username);
  };
  
});

