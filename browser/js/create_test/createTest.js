'use strict';

app.config(function($stateProvider){
	$stateProvider.state('createTest', {
		url: '/createTest',
		controller: 'createTestCtrl',
		templateUrl: '/js/create_test/createTest.html'
	});
});


app.controller('createTestCtrl', function($scope, ExerciseFactory, $timeout, $modal){
	$scope.difficulties = ['Easy','Medium','Hard'];

	$scope.aceLoaded1 = function(_editor){
		$scope.aceSession1 = _editor.getSession();
		// console.log($scope.aceSession1);
	}

	$scope.aceLoaded2 = function(_editor){
		$scope.aceSession2 = _editor.getSession();
		// console.log($scope.aceSession2);
	}

	$scope.difficulties = ['Easy','Medium','Hard'];

	$scope.submitExercise = function(exercise){
		if ($scope.exerciseForm.$invalid) {
			$scope.errMessage = 'You need to fill in all the fields before updating!'
			$scope.exerciseForm.submitted = true;
			return;
		}
		exercise.testCode = $scope.aceSession1.getDocument().getValue();
		exercise.editorPrompt = $scope.aceSession2.getDocument().getValue();
		ExerciseFactory.submitExercise(exercise).then(function (response){
			var modalInstance = $modal.open({
			      templateUrl: '/js/create_test/success-modal.html',
			      controller: function($scope, $modalInstance) {
			          $scope.ok = function() {
			            $modalInstance.close('ok');
			          };
			        }
			    });

			    modalInstance.result.then(function() {
			    	return;
			    }); 
			$scope.exercise = {};
			$scope.aceSession1.getDocument().setValue('');
			$scope.aceSession2.getDocument().setValue('');
			$scope.exerciseForm.submitted = false;
		})
	};
});
