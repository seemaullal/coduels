'use strict';

app.config(function($stateProvider){
	$stateProvider.state('createTest', {
		url: '/createTest',
		controller: 'createTestCtrl',
		templateUrl: '/js/create_test/createTest.html'
	});
});


app.controller('createTestCtrl', function($scope, TestFactory){

	$scope.aceLoaded1 = function(_editor){
		$scope.aceSession1 = _editor.getSession();
		console.log($scope.aceSession1);
	}

	$scope.aceLoaded2 = function(_editor){
		$scope.aceSession2 = _editor.getSession();
		console.log($scope.aceSession2);
	}
	
	$scope.submitTest = function(exercise){
		exercise.testCode = $scope.aceSession1.getDocument().getValue();
		exercise.editorPrompt = $scope.aceSession2.getDocument().getValue();
		console.log(exercise);
		TestFactory.submitTest(exercise).then(function (response){
			console.log(response);
		})
	};
});