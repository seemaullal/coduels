'use strict';

app.config(function($stateProvider){
	$stateProvider.state('settings', {
		url: '/settings',
		controller: 'settingsCtrl',
		templateUrl: '/js/settings/settings.html'
	});
});


app.controller('settingsCtrl', function($scope, ExerciseFactory, $timeout, $modal){
	ExerciseFactory.getExercises().then( function (exercises) {
		$scope.exercises = exercises;
	});
	$scope.editExisting = false;
	$scope.buttonText = "Edit Existing Exercises";

	$scope.difficulties = ['Easy','Medium','Hard'];
	$scope.pickExercise = function() {
		console.log($scope.selectedExercise);
		if (!$scope.selectedExercise) {
			$scope.buttonText = "Add a New Exercise";
			$scope.editExisting = false;
		} else {
			$scope.buttonText = "Edit Exercise";
			$scope.editExisting = true;
		}
		$scope.exerciseForm.submitted = false;
	};

	$scope.addNewExercise = function(exercise){
		if ($scope.exerciseForm.$invalid) {
			$scope.errMessage = 'You need to fill in all the fields before updating!';
			$scope.exerciseForm.submitted = true;
			return;
		}

		ExerciseFactory.submitExercise($scope.selectedExercise).then(function (response){
			var modalInstance = $modal.open({
			      templateUrl: '/js/settings/success-modal.html',
			      controller: function($scope, $modalInstance) {
			          $scope.ok = function() {
			            $modalInstance.close('ok');
			          };
			        }
			    });

			    modalInstance.result.then(function() {
			    	return;
			    }); 
			$scope.selectedExercise = "";
			ExerciseFactory.getExercises().then( function (exercises) {
				$scope.exercises = exercises; //update exercise list with updated exercises
			});		
			$scope.exerciseForm.submitted = false;
		});
	};


	$scope.updateExercise = function(){
		if ($scope.exerciseForm.$invalid) {
			$scope.errMessage = 'You need to fill in all the fields before updating!';
			$scope.exerciseForm.submitted = true;
			return;
		}
		ExerciseFactory.updateExercise($scope.selectedExercise).then ( function (response) {
			$scope.exerciseForm.submitted = false;
			$scope.success = 'Exercise successfully updated';
			$timeout(function() {
				$scope.success = null;
			}, 5000);
			$scope.selectedExercise = "";
			ExerciseFactory.getExercises().then( function (exercises) {
				$scope.exercises = exercises; //update exercise list with updated exercises
			});		
		});
	};

	$scope.deleteExercise = function(){
		ExerciseFactory.deleteExercise($scope.selectedExercise._id).then ( function (response) {
			console.log(response);
			$scope.exerciseForm.submitted = false;
			$scope.success = 'Exercise has been deleted';
			$timeout(function() {
				$scope.success = null;
			}, 5000);
			$scope.exercise = {};
			$scope.selectedExercise = "";
			ExerciseFactory.getExercises().then( function (exercises) {
				$scope.exercises = exercises; //update exercise list with updated exercises
			});		
		});
	};
});
