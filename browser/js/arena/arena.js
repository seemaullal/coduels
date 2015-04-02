'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    resolve: {
      checkAuthorizedUser: function(AuthService, $state, $stateParams) {
        return AuthService.getLoggedInUser().then(function(user) {
          if (!user) {
            alert('You need to log in to participate in a challenge.');
            $state.go('home');
          } else if (user.isAuthorized !== $stateParams.roomKey) {
            alert("Sorry this challenge has already begun :( ");
            $state.go('exercises');
          } else return user;
        });
      }
    },
    url: '/arena/:roomKey',
    controller: 'ArenaController',
    onExit: function(RoomFactory, AuthService, $stateParams) {
      AuthService.getLoggedInUser().then(function(user) {
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

  currFirebaseRoom.once('value', function(snapshot) { //initially get a reference to the game (put on scope)
    $scope.game = snapshot.val();
    if ($scope.game.isPractice) {
      $scope.isPractice = true;
      $scope.waitingDone = true;
    }
    $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId).toString();
  });

  var winnerRef = currFirebaseRoom.child('winner'); //null initially
  var userRef = currFirebaseRoom.child('users'); //Firebase reference to user list
  var socket = io();

  var startTimeFromFb = currFirebaseRoom.child('gameStartTime');
  startTimeFromFb.once('value', function(snapshot) {
    console.log('line 59', snapshot);
    var startTime = new Date(snapshot.val());
    //Display # of failures when arena view changes, before user makes any significant key press.

    function countDown() {
      setTime(Math.max(0, startTime - Date.now()));
      if (startTime <= Date.now()) {
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

          socket.emit('userCode', {
            code: $scope.aceEditor.getDocument().getValue(),
            userId: $scope.user._id
          });
          document.getElementById('mocha-runner').src = document.getElementById('mocha-runner').src;
        });
      }
    }
    var timeout = setInterval(countDown, 1000);

    function setTime(remaining) {
      $scope.timeLeft = remaining;
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    }

  });

  var setColorProperty = function(allTests, failedTests) {
    allTests.forEach(function(test) {
      if (failedTests.indexOf(test.title) > -1) {
        test.color = false;
      } else {
        test.color = true;
      }
    });
    return allTests;
  };

  $scope.allTestTitles = null;
  socket.on('failedTests', function(testTitles) {
    if (testTitles[0] === undefined) {
      return;
    }
    if (!$scope.allTestTitles) {
      $scope.allTestTitles = [];
      testTitles.forEach(function(testTitle) {
        $scope.allTestTitles.push({
          title: testTitle,
          color: false
        });
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

  socket.on('theFailures', function(failures) {
    if (!failures) return;
    if (!$scope.failures) { //get # of tests (initially)
      $scope.numTests = failures.failures;
    }
    $scope.failures = failures.failures;

    //send failures to Firebase
    userRef.once('value', function(userSnapshot) {
      if (!userSnapshot.val()) {
        return;
      }
      userSnapshot.val().forEach(function(user, index) { //Factory where updateFailures(userRef,userId, numberOfFailures)
        if (user._id === failures.userId) {
          var updatedUser = userSnapshot.val()[index]; // userSnapshot.val()[index] is the firebase user that corresponds to the failure obj received
          updatedUser.failures = failures.failures;
          updatedUser.code = failures.userCode;
          userRef.child(index).set(updatedUser);
        }
      });
        if (failures.failures === 0) { //make function for passing all tests?
          if ($scope.user._id === failures.userId) {
            $scope.allTestTitles.forEach(function(test) {
              test.color = true;
            });
            $scope.keyCodeEvents = []; //don't let them type anything else (disables key press events)
            currFirebaseRoom.once('value', function(roomSnapshot) {
              if(!roomSnapshot.val()) return;
              $scope.isWinner = false;
              if (!roomSnapshot.val().winner && !$scope.isPractice) {
                console.log(roomSnapshot.val().winner)
                $scope.isWinner = true;
                winnerRef.set($scope.user);
                userWins($scope.user);
              } else { //they finished the challenges but they are either in practice or are just finishing (but not winning)
                practiceEnds();
              }
              CompletionFactory.sendCompletion($scope.user._id, $scope.game.exerciseId, failures.code, $scope.game.difficulty, userSnapshot.val().length, $scope.isWinner);
            });
          };
        };
    });
  }); // closes socket.on

  userRef.on('value', function(userSnapshot) { //updates user info on scope
    if (!userSnapshot.val()) {
      return;
    }
    $scope.userDisplay = [];
    userSnapshot.val().forEach(function(user) { //factory.getUsers -> returns an array of the users
      var userObj = {};
      userObj.username = user.username;
      userObj.image = user.image;
      userObj.failures = user.failures;
      userObj.totalScore = user.totalScore;
      userObj.passed = $scope.numTests - user.failures;
      $scope.userDisplay.push(userObj);
    });
    if (!$scope.$$phase) {
      //if no digest in progress
      $scope.$digest();
    }
  });

  winnerRef.on('value', function(winnerSnapshot) { //watches the winner reference (sees if someone has won)
    if (winnerSnapshot.val()) {
      $scope.winner = winnerSnapshot.val().username; //updating the winner name

      if ($scope.winner !== $scope.user.username && !$scope.isPractice) { //modal if you are not the winner
        var notWinnerModal = $modal.open({
          templateUrl: '/js/arena/not-winner-modal.html',
          resolve: {
            data: function(AuthService) {
              return AuthService.getLoggedInUser().then(function(user) {
                return user;
              })
            }
          },
          controller: function($scope, $modalInstance, data) {
            $scope.user = data;
            $scope.ok = function() {
              $modalInstance.close('ok');
            };
            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
              $state.go("about");
            }
          }
        });
        notWinnerModal.result.then(function() {
          if ($modalInstance.dismiss('cancel')) {
            $state.go("about");
          }
        })
      }

      if (!$scope.$$phase) {
        //if no digest in progress
        $scope.$digest();
      }
    }
  });

  function userWins(user) {
    // $scope.isWinner = true;
    var winnerModal = $modal.open({
      templateUrl: '/js/arena/winner-modal.html',
      controller: function($scope, $modalInstance) {
        $scope.user = user;
        console.count('modal called #');
        $scope.ok = function() {
          $modalInstance.close('ok');
        };
      }
    });
    winnerModal.result.then(function() {
      console.log('how many times are you happening?')
      $state.go("about");
      return;
    });
  }

  function practiceEnds() {
    var practiceModal = $modal.open({
      templateUrl: '/js/arena/practice-modal.html',
      controller: function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close('ok');
        };
      }
    });
    practiceModal.result.then(function() {
      $state.go("exercises");
      return;
    });
  }
}); // closes controller}
