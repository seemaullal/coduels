'use strict';

app.directive('uniqueusername', function(UsersFactory, $q){
	return {
		require: 'ngModel',
		restrict: '',
    	link: function(scope, elm, attrs, ctrl) {
    		ctrl.$asyncValidators.uniqueusername = function(modelValue,viewValue) {
          return UsersFactory.getAllUsers().then(function (users) {
	    			var usernames = users.map(function(user) {
	    				return user.username;
	    			});
   					if (usernames.indexOf(viewValue) > -1) {
   						return $q.reject("Not unqiue");
   					}
   					else {
   						return true;
   					}
    			});
    		};
    	}
	};
});