'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    url: '/arena/:roomKey',
    controller: 'ArenaController',
    templateUrl: 'js/arena/arena.html'
  });
});

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService) {

  $scope.waitingDone = false;
  // var socket = io();

  // sets the logged-in user on the scope and creates a new room with that user
  // in the newly created room
  // AuthService.getLoggedInUser().then(function(user) {
  //   $scope.user = user;
  //   $scope.roomKey = RoomFactory.createRoom('exercise', $scope.user);
  // });
 var startTimeFromFb = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/gameStartTime');
  startTimeFromFb.once('value', function(snapshot) {
      var startTime = new Date(snapshot.val());
      var timeout = setInterval(countDown, 1000);
      function countDown() {
        setTime(Math.max(0, startTime - Date.now()));
        if (startTime <= Date.now() ) {
          // $state.go('exercises');
          clearInterval(timeout);
          $scope.waitingDone = true;
          $scope.$digest();
        }
      }

      function setTime(remaining) {
      //   var minutes = Math.floor(remaining/60000);
      //   var secs = Math.round(remaining/1000);
        $scope.timeLeft = remaining
        // minutes + ':' + secs;
        $scope.$digest();
      }

  });



  // defines and sets the onLoad callback function on the scope
  $scope.userInputSession = function(_editor) {
    $scope.aceEditor = _editor.getSession();
    // $scope.getUserInput(_editor);
    // console.log($scope.aceEditor);
  };


  var exerciseIdFromFb = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/exerciseId');
  exerciseIdFromFb.once('value', function(snapshot) {
      $scope.exerciseId = snapshot.val();
      $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.exerciseId).toString();
  });

  var editorPromptFromFb = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/editorPrompt');
  editorPromptFromFb.once('value', function(snapshot) {
    console.log("editor prompt",snapshot.val());
    $scope.editorPrompt = snapshot.val();

  });

}); // closes controller
