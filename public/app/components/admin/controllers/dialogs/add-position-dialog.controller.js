adminModule
	.controller('addPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Position', function($scope, $mdDialog, Preloader, Department, Position){
		var departmentID = Preloader.get();

		$scope.position = {};
		$scope.position.department_id = departmentID;


		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addPositionForm.$invalid){
				angular.forEach($scope.addPositionForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				/* Starts Preloader */
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				Position.store($scope.position)
					.then(function(){
						// Stops Preloader 
						Preloader.stop();
					}, function(){
						Preloader.error();
					});
			}
		}
	}]);