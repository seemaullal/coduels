'use strict';
app.factory('UsersFactory', function($http) {
	var factory = {};

	factory.getAllUsers = function() {
		return $http.get('/api/users').then(function(response) {
			return response.data;
		});
	};

	return factory;
})