'use strict';
app.config(function($stateProvider) {
    $stateProvider.state('arena', {
        url: '/arena',
        controller: 'ArenaController',
        templateUrl: 'js/arena/arena.html'
    });
});

app.controller('ArenaController', function($scope, RoomFactory, AuthService) {
    AuthService.getLoggedInUser().then(function(user) {
        $scope.user = user;
        $scope.test = RoomFactory.createRoom('exercise', $scope.user);
    });

    $scope.aceLoaded3 = function(_editor) {
      $scope.aceSession3 = _editor.getSession();
      console.log($scope.aceSession3);
    };

    $scope.getUserInput = function(_editor) {
        $(document).ready(function() {
            // userPad is a reference to the JSON object at the url
            var userPad = new Firebase('http://dazzling-torch-169.firebaseio.com/codes');

            // // the next three lines set up the Ace editor
            // var editor = ace.edit("editor");
            // editor.setTheme("ace/theme/monokai");
            // editor.getSession().setMode("ace/mode/javascript");

            // we access the editor using jQuery and on each 'keyup', we check whether
            // a particular keycode was pressed, in this case, the enter key (13)
            $('#userInput').keyup(function(e) {
                // var keyCodeEvents = [13,32,186,8,46];
                var keyCodeEvents = [13];
                if (keyCodeEvents.indexOf(e.keyCode) > -1) {
                    // if the enter key is pressed, we set the value of the userPad,
                    // the JSON object at the url, to the value of whatever is in the
                    // editor after enter key is pressed
                    userPad.set($scope.aceSession3.getDocument().getValue());
                    // the next line refreshes the iframe but I'm not sure this is entirely necessary
                    // I believe I put this in initially because every time the test runs, it appends
                    // another copy of the test to the iframe which was visually unruly, but has no
                    // effect on the testing process
                    document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;
                }
            });
        });
    }
});
