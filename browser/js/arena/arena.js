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

app.controller('ArenaController', function($scope, $stateParams, $sce, RoomFactory, AuthService) {

  $scope.waitingDone = false;
  // var socket = io();

  // sets the logged-in user on the scope and creates a new room with that user
  // in the newly created room
   AuthService.getLoggedInUser().then(function(user) {
      $scope.user = user;
   });

 var startTimeFromFb = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey + '/gameStartTime');
  startTimeFromFb.once('value', function(snapshot) {
      var startTime = new Date(snapshot.val());
      function countDown() {
        setTime(Math.max(0, startTime - Date.now()));
        if (startTime <= Date.now() ) {
          // $state.go('exercises');
          clearInterval(timeout);
          AuthService.getLoggedInUser().then(function(user) {
            user.isAuthorized = null;
            console.log('should be null for authorized', user);
            $scope.waitingDone = true;
          });
        }
      }
      var timeout = setInterval(countDown, 1000);

      function setTime(remaining) {
      //   var minutes = Math.floor(remaining/60000);
      //   var secs = Math.round(remaining/1000);
        $scope.timeLeft = remaining;
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


  var roomInfo = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey);
  roomInfo.once('value', function(snapshot) {
      $scope.game = snapshot.val();
      $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId).toString();
  });

  var socket = io();

  var ref = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+$stateParams.roomKey+'/users');

  socket.on('theFailures', function (failures){
    $scope.failures = failures.failures;
    //send failures to Firebase
    ref.once('value', function (userSnapshot){
      console.log(userSnapshot.val());
      userSnapshot.val().forEach(function (user, index){
        if (user._id == failures.userId){
          var updatedUser = userSnapshot.val()[index];
          updatedUser.failures = failures.failures;
          ref.child(index).set(updatedUser);
          if (failures.failures === 0) {
            roomInfo.once('value', function(roomSnapshot) {
              if(!roomSnapshot.val().winner) {
                roomInfo.child('winner').set(updatedUser)
              } // closes if (!roomSnapshot)
              // factory.sendCompletion = function (exerciseID, userID, code, difficulty, numUsers){}
            }) // closes roomInfo.once
          } // closes if (failures.failures) statement
        }; // closes if (user._id) statement
      }); // closes forEach
    }); // closes ref.once
  }); // closes socket.on

  var winnerRef = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/'+$stateParams.roomKey+'/winner');

  winnerRef.on('value', function(winnerSnapshot) {
    $scope.winner = winnerSnapshot.val().username;
    $scope.$digest();
  })

  ref.on('value', function (userSnapshot){
    $scope.userDisplay = [];
    userSnapshot.val().forEach(function (user){
      var userObj = {};
      userObj.username = user.username;
      userObj.failures = user.failures;
      $scope.userDisplay.push(userObj);
      console.log("UserDisplay", $scope.userDisplay);
    });
    $scope.$digest();
  });


}); // closes controller
