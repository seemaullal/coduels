'use strict';
app.factory('TestFactory', function (){
	var factory = {};

	factory.submitTest = function (test) {
		$http.post('/api/test', {}).then(function(response){
			return response;
		});
	};

	return factory;
})