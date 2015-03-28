'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, AuthService, TestFactory) {

	AuthService.getLoggedInUser().then(function(user){
		$scope.user = user
        
        console.log("user unique challenges", $scope.user.uniqueChallenges)

        TestFactory.getExercises().then(function(data) {
            $scope.userChallenges = [];
            var exercisesInfo = _.pluck(data, "_id");

            $scope.user.uniqueChallenges.forEach(function(challenge) {
                var userChallenges = {};
                var index = exercisesInfo.indexOf(challenge);
                if(index == -1) {
                    console.log('there are no unique challenges')
                } else {
                    userChallenges = data[index];
                    $scope.userChallenges.push(userChallenges);
                }
            })

            console.log('exercisesinfo please', $scope.userChallenges);
        })
    })


});