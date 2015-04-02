'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html',
        resolve: {
        	test: function(AuthService, $state) {
        		AuthService.getLoggedInUser().then(function(user) {
        			if (user && !user.username) $state.go('createUsername');
        		});
        	},
            onEnter: function() {
                var roomsRef = new Firebase('http://dazzling-torch-169.firebaseio.com/rooms/');
                roomsRef.once('value', function(roomsSnapshot) {
                    for (var key in roomsSnapshot.val()) {
                        if (Date.now() - roomsSnapshot.val()[key].gameStartTime > 7200000) {
                            roomsRef.child(key).remove();
                        }

                    }
                });
            }
        }
    });
});

app.controller('HomeCtrl', function($rootScope, $scope, AuthService, AUTH_EVENTS, UsersFactory) {

    UsersFactory.getAllUsers().then(function(users) {
		$scope.users = users;
		users.sort(function(user1, user2) {
			return user2.totalScore - user1.totalScore;
		});

		$scope.topFive = [];


		var five = users.slice(0, 5);
			$scope.topFive.push(five);
			$scope.topFive = five;


    });
        var setUser = function () {
            AuthService.getLoggedInUser().then(function (user) {
                $scope.user = user;
            });
        };

        var removeUser = function () {
            $scope.user = null;
        };

        setUser();

        $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);

});
