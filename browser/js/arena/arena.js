'use strict';
app.config(function($stateProvider) {
  $stateProvider.state('arena', {
    resolve: {
      checkAuthorizedUser : function(AuthService, $state, $stateParams) {
        return AuthService.getLoggedInUser().then(function(user) {
          console.log(user.isAuthorized === $stateParams.roomKey); //should be false;
          console.log(user.isAuthorized);
          console.log($stateParams.roomKey);
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


  var roomInfo = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms/' + $stateParams.roomKey);
  roomInfo.once('value', function(snapshot) {
      $scope.game = snapshot.val();
      $scope.srcUrl = $sce.trustAsResourceUrl('/api/arena/iframe/' + $scope.game.exerciseId).toString();
  });

  var socket = io();

  var ref = new Firebase('https://dazzling-torch-169.firebaseio.com/rooms/'+$stateParams.roomKey+'/users');

  socket.on('theFailures', function (failures){
    $scope.failures = failures.failures;
    //send failures to Firebase
    ref.once('value', function (userSnapshot){
      // console.log(userSnapshot.val());
      userSnapshot.val().forEach(function (user,index){
        if (user._id == failures.userId){
          console.log('this is the userId tied to failures in arena.js', failures.userId)
          var updatedUser = userSnapshot.val()[index];
          updatedUser.failures = failures.failures;
          console.log('the updated user object', updatedUser);
          ref.child(index).set(updatedUser);
        };
      });
    });
  });



  ref.on('value', function (userSnapshot){
    $scope.userDisplay = [];
    userSnapshot.val().forEach(function (user){
      var userObj = {};
      userObj.username = user.username;
      userObj.failures = user.failures;
      $scope.userDisplay.push(userObj);
      // console.log("UserDisplay", $scope.userDisplay);
    });
    $scope.$digest();
  });


}); // closes controller
