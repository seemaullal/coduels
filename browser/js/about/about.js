'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, AuthService) {
	AuthService.getLoggedInUser().then(function(user){
		$scope.user = user
		console.log('total user score',  user);

	})

});