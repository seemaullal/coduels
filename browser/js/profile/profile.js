'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('profile', {
        url: '/profile',
        controller: 'AboutController',
        templateUrl: 'js/profile/profile.html',
        resolve: {
            test: function(AuthService, $state) {
                AuthService.getLoggedInUser().then(function(user) {
                    if (user && !user.username) $state.go('createUsername');
                });
            }
        }
    });

});

app.controller('AboutController', function ($scope, AuthService, ExerciseFactory, UsersFactory) {

    AuthService.getLoggedInUser().then( function(archivedUser){
        UsersFactory.getUser(archivedUser._id).then( function(user) {
            $scope.user = user;

            ExerciseFactory.getExercises().then(function(data) {
                $scope.easyTotal = [];
                $scope.medTotal = [];
                $scope.hardTotal = [];

                var difficulties = _.pluck(data, 'difficulty');
               
                
                difficulties.forEach(function(value) {
                    if(value === "Easy") {
                        $scope.easyTotal.push(value);
                    } else if(value === "Medium") {
                        $scope.medTotal.push(value);
                    } else if(value === "Hard") {
                        $scope.hardTotal.push(value);
                    }
                });

                $scope.userChallenges = [];
                var exercisesInfo = _.pluck(data, "_id");
                $scope.user.uniqueChallenges.forEach(function(
                    challenge) {
                    console.log('challenge', challenge);
                    var userChallenges = {};
                    var index = exercisesInfo.indexOf(challenge._id);
                    if(index === -1) {
                        console.log('No challenges completed');
                    } else {
                        $scope.none = false;
                        userChallenges = data[index];
                        $scope.userChallenges.push(userChallenges);

                        $scope.userEasy = [];
                        $scope.userMed = [];
                        $scope.userHard = [];

                        $scope.userChallenges.forEach(function(challenge) {
                            if(!challenge.difficulty) {
                                return 0;
                            } else if(challenge.difficulty === "Easy" ) {
                                $scope.userEasy.push(challenge.difficulty)
                            } else if(challenge.difficulty === "Medium") {
                                $scope.userMed.push(challenge.difficulty);
                            } else if(challenge.difficulty === "Hard") {
                                $scope.userHard.push(challenge.difficulty);
                            }
                            
                        })
                    }
                }); //forEach user uniqueChallenges
            }); // close ExerciseFactory
        }); //close UsersFactory   
    }); //close AuthService
}); // close controller