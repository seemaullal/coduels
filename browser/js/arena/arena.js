'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    url: '/arena/:roomKey',
    controller: 'ArenaController',
    templateUrl: 'js/arena/arena.html'
  });
});

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService) {

  var socket = io();

  // sets the logged-in user on the scope and creates a new room with that user
  // in the newly created room
  // AuthService.getLoggedInUser().then(function(user) {
  //   $scope.user = user;
  //   $scope.roomKey = RoomFactory.createRoom('exercise', $scope.user);
  // });
 var startTimeFromFb = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/gameStartTime');
  startTimeFromFb.once('value', function(snapshot) {
      var startTime = new Date(snapshot.val());
      console.log('start time: ',startTime);
      var timeout = setInterval(countDown, 1000);
      function countDown() {
        setTime(Math.max(0, startTime - Date.now()));
        if (startTime <= Date.now() ) { 
          $state.go('exercises');
          clearInterval(timeout); 
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
    $scope.getUserInput(_editor);
    // console.log($scope.aceEditor);
  };

  $scope.getUserInput = function(_editor) {
    // $(document).ready(function() {

      // userPad is a reference to the JSON object at the url
      var userPad = new Firebase('http://dazzling-torch-169.firebaseio.com/codes');
      // we access the editor using jQuery and on each 'keyup', we check whether
      // a particular keycode was pressed, in this case, the enter key (13)
      $('#userInput').keyup(function(e) {
        // var keyCodeEvents = [13,32,186,8,46];
        var keyCodeEvents = [13];
        if (keyCodeEvents.indexOf(e.keyCode) > -1) {

          // userPad.set($scope.aceEditor.getDocument().getValue());
          socket.emit('userCode', $scope.aceEditor.getDocument().getValue());

          // the next line refreshes the iframe but I'm not sure this is entirely necessary
          // I believe I put this in initially because every time the test runs, it appends
          // another copy of the test to the iframe which was visually unruly, but has no
          // effect on the testing process
          document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;
        } // closes if statement
      }); // closes keyup function
    // }); // closes document.ready
  }; // closes getUserInput

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
