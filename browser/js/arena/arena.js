'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    url: '/arena',
    controller: 'ArenaController',
    templateUrl: 'js/arena/arena.html'
  });
});

app.controller('ArenaController', function($scope, RoomFactory, AuthService) {

  // sets the logged-in user on the scope and creates a new room with that user
  // in the newly created room
  AuthService.getLoggedInUser().then(function(user) {
    $scope.user = user;
    $scope.roomKey = RoomFactory.createRoom('exercise', $scope.user);
  });

  // defines and sets the onLoad callback function on the scope
  $scope.userInputSession = function(_editor) {
    $scope.aceEditor = _editor.getSession();
    console.log($scope.aceEditor);
  };

  // defines and sets the onChange callback function on the scope
  $scope.getUserInput = function(_editor) {
    $(document).ready(function() {

      // userPad is a reference to the JSON object at the url
      var userPad = new Firebase('http://dazzling-torch-169.firebaseio.com/codes');

      // we access the editor using jQuery and on each 'keyup', we check whether
      // a particular keycode was pressed, in this case, the enter key (13)
      $('#userInput').keyup(function(e) {
        // var keyCodeEvents = [13,32,186,8,46];
        var keyCodeEvents = [13];
        if (keyCodeEvents.indexOf(e.keyCode) > -1) {

          // if the enter key is pressed, we set the value of the userPad,
          // the JSON object at the url, to the value of whatever is in the
          // editor after enter key is pressed
          userPad.set($scope.aceEditor.getDocument().getValue());

          // the next line refreshes the iframe but I'm not sure this is entirely necessary
          // I believe I put this in initially because every time the test runs, it appends
          // another copy of the test to the iframe which was visually unruly, but has no
          // effect on the testing process
          document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;

        } // closes if statement
      }); // closes keyup function
    }); // closes document.ready
  }; // closes getUserInput

  $scope.userInputCode = 'function add(one, two) {\n\n}';
}); // closes controller
