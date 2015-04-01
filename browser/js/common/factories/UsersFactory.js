'use strict';
app.factory('UsersFactory', function($http) {
	var factory = {};

	factory.getAllUsers = function() {
		return $http.get('/api/users').then(function(response) {
			return response.data;
		});
	};

	factory.getUser = function(userId) {
		return $http.get('/api/user/' + userId).then(function(response) {
			return response.data;
		});
	};

	factory.updateUser= function(user) {
		return $http.put('/api/users', user ).then(function(response) {
			return response.data;
		});
	};

	return factory;
});