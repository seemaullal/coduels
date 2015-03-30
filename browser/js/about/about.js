'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, AuthService, TestFactory, UsersFactory) {

    AuthService.getLoggedInUser().then( function(archivedUser){
        UsersFactory.getUser(archivedUser._id).then( function(user) {
            $scope.user = user;
            

            TestFactory.getExercises().then(function(data) {
                $scope.easyTotal = [];
                $scope.medTotal = [];
                $scope.hardTotal = [];

                console.log('user information', $scope.user);

                

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

                $scope.user.uniqueChallenges.forEach(function(challenge) {

                    var userChallenges = {};
                    var index = exercisesInfo.indexOf(challenge);
                    if(index === -1) {
                        console.log('No challenges completed');
                    } else {
                        $scope.none = false;
                        userChallenges = data[index];

                        userChallenges.userCode = $scope.user.exercises;
                        $scope.userChallenges.push(userChallenges);

                        console.log('user challenges', $scope.userChallenges.userCode)

                        $scope.userEasy = [];
                        $scope.userMed = [];
                        $scope.userHard = [];


                        $scope.userChallenges.forEach(function(challenge) {
                            console.log('individual user challenge', challenge.userCode)
                            var codes = _.pluck(challenge.userCode, "exerciseID");
                            var i = codes.indexOf(challenge.userCode);
                            console.log('what is i', i);
                            console.log('code ids', codes);
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
            }); // close TestFactory
        }); //close UsersFactory   
    }); //close AuthService
}); // close controller