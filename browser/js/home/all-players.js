'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('allplayers', {
        url: '/home/allplayers/',
        controller: 'AllScoresCtrl',
        templateUrl: 'js/home/all-players.html',
        
    });
});

app.controller('AllScoresCtrl', function($scope, AuthService, UsersFactory, $stateParams) {

    $stateParams.user;

	UsersFactory.getAllUsers().then(function(users) {
        $scope.users = users;
        $scope.users.sort(function(user1, user2) {
            return user2.totalScore - user1.totalScore;

		});



	});

});