'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    resolve: {
      checkAuthorizedUser : function(AuthService, $state, $stateParams) {
        return AuthService.getLoggedInUser().then(function(user) {
          if (!user) {
            alert('You need to log in to participate in a challenge.');
            $state.go('home');
          }
          if (user.isAuthorized !== $stateParams.roomKey) {
            alert("Sorry this challenge has already begun :( ");
              $state.go('exercises');
          }
        })
      }
    },
    url: '/arena/:roomKey',
    controller: 'ArenaController',
    templateUrl: 'js/arena/arena.html'
  });
});

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService, CompletionFactory) {

  $scope.waitingDone = false;
  $scope.isPractice = false;


 var socket = io();

 var startTimeFromFb = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/gameStartTime');
  startTimeFromFb.once('value', function(snapshot) {
      var startTime = new Date(snapshot.val());
      function countDown() {
        setTime(Math.max(0, startTime - Date.now()));
        if (startTime <= Date.now() ) {
          // $state.go('exercises');
          clearInterval(timeout);
          AuthService.getLoggedInUser().then(function(user) {
            user.isAuthorized = null;
            $scope.waitingDone = true;
            if ($scope.userDisplay.length === 1) {
              /*even if a user joined a challenge, if
              they are the only one there, consider it practice*/
              $scope.isPractice = true;
            }
            //Display # of failures when arena view changes, before user makes any significant key press.
            socket.emit('userCode', {code: $scope.aceEditor.getDocument().getValue(), userId: $scope.user._id});
            document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;
          });
        }
      }
      var timeout = setInterval(countDown, 1000);

      function setTime(remaining) {
      //   var minutes = Math.floor(remaining/60000);
      //   var secs = Math.round(remaining/1000);
        $scope.timeLeft = remaining;
        // minutes + ':' + secs;
        if(!$scope.$$phase) {
          //if no digest in progress
          $scope.$digest();
        }
      }

  });


  socket.on('failedTests', function(testTitles) {
      $scope.failedTestTitles = testTitles;
      $scope.$digest();
  })

  // defines and sets the onLoad callback function on the scope
  $scope.userInputSession = function(_editor) {
    $scope.aceEditor = _editor.getSession();
  };

  var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+$stateParams.roomKey+'/users');

  socket.on('theFailures', function (failures){
    if (!$scope.failures) {$scope.numTests = failures.failures;}
    $scope.failures = failures.failures;
    //send failures to Firebase
    ref.once('value', function (userSnapshot){
      userSnapshot.val().forEach(function (user, index){
        if (user._id == failures.userId){
          console.log('this is the userId tied to failures in arena.js', failures.userId)
          var updatedUser = userSnapshot.val()[index];
          updatedUser.failures = failures.failures;

          // Only include if we want passed tests as a user property in firebase.
          // updatedUser.passed = $scope.numTests - failures.failures;
          updatedUser.code = failures.userCode
          ref.child(index).set(updatedUser);
          if (failures.failures === 0) {
            $scope.keyCodeEvents = [];
            roomInfoRef.once('value', function(roomSnapshot) {
              var isWinner = false;
              if(!roomSnapshot.val().winner) {
                roomInfoRef.child('winner').set(updatedUser);
                isWinner = true;
              } // closes if (!roomSnapshot)

              CompletionFactory.sendCompletion(user._id, $scope.game.exerciseId, updatedUser.code, $scope.game.difficulty, userSnapshot.val().length, isWinner);
            }) // closes roomInfoRef.once
          } // closes if (failures.failures) statement
        }; // closes if (user._id) statement
      }); // closes forEach
    }); // closes ref.once
  }); // closes socket.on

  ref.on('value', function (userSnapshot){
    $scope.userDisplay = [];
    userSnapshot.val().forEach(function (user){
      var userObj = {};
      userObj.username = user.username;
      userObj.failures = user.failures;
      userObj.passed = $scope.numTests - user.failures;
      $scope.userDisplay.push(userObj);
    });
    if(!$scope.$$phase) {
      //if no digest in progress
      $scope.$digest();
    }

  var winnerRef = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+$stateParams.roomKey+'/winner');

  winnerRef.on('value', function(winnerSnapshot) {
    if (winnerSnapshot.val()){
      $scope.winner = winnerSnapshot.val().username;
      if(!$scope.$$phase) {
        //if no digest in progress
        $scope.$digest();
      }
    }
  });

  });
 var roomInfoRef = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey);
 roomInfoRef.once('value', function(snapshot) {
     $scope.game = snapshot.val();
     if ($scope.game.isPractice) {
       $scope.isPractice = true;
       $scope.waitingDone = true;
     }
     $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId).toString();
 });

  AuthService.getLoggedInUser().then(function(user) {
     $scope.user = user;
  });

}); // closes controller
