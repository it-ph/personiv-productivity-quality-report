adminModule
	.controller('addDepartmentDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		$scope.department = {};
		var busy = false;

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Department.checkDuplicate($scope.department)
				.success(function(data){
					$scope.duplicate = data;
				});
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addDepartmentForm.$invalid){
				angular.forEach($scope.addDepartmentForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				/* Starts Preloader */
				// Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy && !$scope.duplicate){
					busy = true;
					Department.store($scope.department)
						.success(function(data){
							if(data){
								busy = false;
								$scope.duplicate = data;
							}
							else{
								// Stops Preloader 
								Preloader.stop();
								busy = false;
							}
						}, function(){
							Preloader.error();
						});
				}
			}
		}
	}]);