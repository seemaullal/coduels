'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('viewCode', {
        url: '/viewCode/:user',
        controller: 'ViewCodeCtrl',
        templateUrl: 'js/home/view-code.html',
        
    });
});

app.controller('ViewCodeCtrl', function($scope, AuthService, UsersFactory, $stateParams, ExerciseFactory) {

	AuthService.getLoggedInUser().then(function(archivedUser) {
		UsersFactory.getUser(archivedUser._id).then(function(user) {
			$scope.user = user;
		
		UsersFactory.getUser($stateParams.user).then(function(data) {
			$scope.viewUser = data;

		// var whatIsThis =_.filter(.uniq($scope.user.uniqueChallenges), function(item) {
  // 			return _.every($scope.viewUser.uniqueChallenges, function(other) {
  // 		//return _.indexOf(other, item) >= 0;
  // 			return _.any(other, function(element) { return _.isEqual(element, item); });
  // 		});

  // 			console.log('what is this?', whatIsThis);
		
		console.log('logged in user', $scope.user);
		console.log('view this user code', $scope.viewUser);
		// console.log('intersection', userIntersection);
		})
	})
		
		
	})

	
	

})