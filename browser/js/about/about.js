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
                $scope.userChallenges = [];
                var exercisesInfo = _.pluck(data, "_id");

                $scope.user.uniqueChallenges.forEach(function(challenge) {
                    var userChallenges = {};
                    var index = exercisesInfo.indexOf(challenge);
                    if(index === -1) {
                        console.log('there are no unique challenges');
                    } else {
                        userChallenges = data[index];
                        $scope.userChallenges.push(userChallenges);
                    }
                });
            });
        });   
    });
});