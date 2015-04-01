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
        });
      }
    },
    url: '/arena/:roomKey',
    controller: 'ArenaController',
    onExit: function(RoomFactory, AuthService, $stateParams) {
      AuthService.getLoggedInUser().then(function(user){
        RoomFactory.removeUserFromRoom(user._id, $stateParams.roomKey);
      });
    },
    templateUrl: 'js/arena/arena.html'
  });
});

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService, CompletionFactory, $modal, $state) {
  AuthService.getLoggedInUser().then(function(user) {
     $scope.user = user;
  });
  $scope.waitingDone = false;
  $scope.isPractice = false;
  var currFirebaseRoom = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey);

  var socket = io();

  var startTimeFromFb = currFirebaseRoom.child('gameStartTime');
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
        $scope.timeLeft = remaining;
        if(!$scope.$$phase) {
          $scope.$digest();
        }
      }

  });

  var winnerRef = currFirebaseRoom.child('winner');

  var setColorProperty = function (allTests, failedTests){
    allTests.forEach(function (test){
      if( failedTests.indexOf(test.title) > -1){
        test.color = false;
      } else {
        test.color = true;
      }
    });
    return allTests;
  };

  $scope.allTestTitles = null;
  socket.on('failedTests', function(testTitles) {
    if (testTitles[0] === undefined){ return; }
      if (!$scope.allTestTitles){
        $scope.allTestTitles = [];
        testTitles.forEach(function (testTitle){
            $scope.allTestTitles.push({title: testTitle, color: false});
          });
      }
      $scope.failedTestTitles = testTitles;
      $scope.allTestTitles = setColorProperty($scope.allTestTitles, $scope.failedTestTitles);
      $scope.$digest();
  });

  // defines and sets the onLoad callback function on the scope
  $scope.userInputSession = function(_editor) {
    $scope.aceEditor = _editor.getSession();
  };

var userRef = currFirebaseRoom.child('users');
socket.on('theFailures', function (failures){
  if (!$scope.failures) {$scope.numTests = failures.failures;}
  $scope.failures = failures.failures;
  //send failures to Firebase
  userRef.once('value', function (userSnapshot){
    if (!userSnapshot.val()) {return;}
    userSnapshot.val().forEach(function (user, index){
      if (user._id == failures.userId){
        var updatedUser = userSnapshot.val()[index];
        updatedUser.failures = failures.failures;
        // Only include if we want passed tests as a user property in firebase.
        // updatedUser.passed = $scope.numTests - failures.failures;
        updatedUser.code = failures.userCode;
        userRef.child(index).set(updatedUser);
        if (failures.failures === 0) {
          $scope.allTestTitles.forEach(function(test) {
            test.color = true;
          });
          $scope.keyCodeEvents = [];
          currFirebaseRoom.once('value', function(roomSnapshot) {
            var isWinner = false;
            if(!roomSnapshot.val().winner) {
              winnerRef.set(updatedUser);
              isWinner = true;
            } // closes if (!roomSnapshot)

            CompletionFactory.sendCompletion(user._id, $scope.game.exerciseId, updatedUser.code, $scope.game.difficulty, userSnapshot.val().length, isWinner);
            if ($scope.isPractice) {
              var modalInstance = $modal.open({
                    templateUrl: '/js/arena/practice-modal.html',
                    controller: function($scope, $modalInstance) {
                        $scope.ok = function() {
                          $modalInstance.close('ok');
                        };
                      }
              });
              modalInstance.result.then(function() {
                $state.go("exercises");
                return;
              });
            }
          }); // closes currFirebaseRoom.once
        } // closes if (failures.failures) statement
      } // closes if (user._id) statement
    }); // closes forEach
  }); // closes ref.once
}); // closes socket.on

  userRef.on('value', function (userSnapshot){
    if (!userSnapshot.val()) {return;}
    $scope.userDisplay = [];
    userSnapshot.val().forEach(function (user){
      var userObj = {};
      userObj.username = user.username;
      userObj.image = user.image;
      userObj.failures = user.failures;
      userObj.totalScore = user.totalScore;
      userObj.passed = $scope.numTests - user.failures;
      $scope.userDisplay.push(userObj);
    });
    if(!$scope.$$phase) {
      //if no digest in progress
      $scope.$digest();
    }
  });

  winnerRef.on('value', function(winnerSnapshot) {
    if (winnerSnapshot.val()){
      $scope.winner = winnerSnapshot.val().username;
      if(!$scope.$$phase) {
        //if no digest in progress
        $scope.$digest();
      }
    }
  });

 currFirebaseRoom.once('value', function(snapshot) {
     $scope.game = snapshot.val();
     if ($scope.game.isPractice) {
       $scope.isPractice = true;
       $scope.waitingDone = true;
     }
     $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId).toString();
 });

}); // closes controller
