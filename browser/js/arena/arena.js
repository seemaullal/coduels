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

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService, CompletionFactory, $modal, $state, $firebaseArray) {
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
        $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId + "?roomKey=" + $stateParams.roomKey).toString();
    });

    var winnerRef = currFirebaseRoom.child('winner'); //null initially
    var userRef = currFirebaseRoom.child('users'); //Firebase reference to user list
    // var socket = io();

    $scope.allTestTitles = null;
    userRef.on('value', function(userSnapshot) {
        if (!userSnapshot.val()) return;
        if (!$scope.numTests && userSnapshot.val()[0].failures) {
            $scope.numTests = userSnapshot.val()[0].failures;
        }
        $scope.fbUsers = _.values(userSnapshot.val());
        $scope.fbUsers.forEach(function(user) {
            user.passed = $scope.numTests - user.failures;
            if (user._id === $scope.user._id) {
                if (user.failedTestsArr) {
                    if (!$scope.allTestTitles) {
                        $scope.allTestTitles = [];
                        user.failedTestsArr.forEach(function(testTitle) {
                            $scope.allTestTitles.push({
                                title: testTitle,
                                color: false
                            });
                        });
                    }
                    $scope.failedTestTitles = user.failedTestsArr;
                    $scope.allTestTitles = setColorProperty($scope.allTestTitles, $scope.failedTestTitles);
                    $scope.$digest();
                }

                if (user.failures === 0) {
                    //you have no failures i.e. either won or finished the exercise as practice-ish
                    $scope.allTestTitles.forEach(function(test) {
                        test.color = true;
                    });
                    $scope.keyCodeEvents = [];
                    currFirebaseRoom.once('value', function(roomSnapshot) {
                        if (!roomSnapshot.val()) {
                            return;
                        }
                        $scope.isWinner = false;
                        if (!roomSnapshot.val().winner && !$scope.isPractice) {
                            $scope.isWinner = true;
                            winnerRef.set($scope.user);
                            userWins($scope.user);
                        } else { //they finished the challenges but they are either in practice or are just finishing (but not winning)
                            practiceEnds();
                        }
                        CompletionFactory.sendCompletion($scope.user._id, $scope.game.exerciseId, $scope.userCode, $scope.game.difficulty, $scope.fbUsers.length, $scope.isWinner).then(function(err, data) {
                            if (err)
                                console.log('error', err);
                        });
                    });
                }
            }
        });
    });

    var startTimeFromFb = currFirebaseRoom.child('gameStartTime');
    startTimeFromFb.once('value', function(snapshot) {
        var startTime = new Date(snapshot.val());
        //Display # of failures when arena view changes, before user makes any significant key press.
        function countDown() {
            setTime(Math.max(0, startTime - Date.now()));
            if (startTime <= Date.now()) {
                clearInterval(timeout);
                AuthService.getLoggedInUser().then(function(user) {

                    user.isAuthorized = null;

                    $scope.waitingDone = true;
                    if ($scope.fbUsers.length === 1) {
                        /*even if a user joined a challenge, if
                        they are the only one there, consider it practice*/
                        $scope.isPractice = true;
                    }
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



    // defines and sets the onLoad callback function on the scope
    $scope.userInputSession = function(_editor) {
        $scope.aceEditor = _editor.getSession();
        jQuery.event.trigger({
            type: "keydown",
            keyCode: 32
        });
    };

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
                            });
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
                        };
                    }
                });
            }
        }
    });

    function userWins(updatedUser) {
        $scope.isWinner = true;
        var winnerModal = $modal.open({
            templateUrl: '/js/arena/winner-modal.html',
            resolve: {
                data: function(AuthService) {
                    return AuthService.getLoggedInUser().then(function(user) {
                        return user;
                    });
                }
            },
            controller: function($scope, $modalInstance, data) {
                $scope.user = data;
                $scope.ok = function() {
                    $modalInstance.close('ok');

                };
            }
        });
        winnerModal.result.then(function() {
            $state.go("about");
            return;
        });
    }

    function practiceEnds() {
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

}); // closes controller
