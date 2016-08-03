adminModule
	.controller('addProjectDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Department', 'Project', function($scope, $stateParams, $mdDialog, Preloader, Department, Project){
		var departmentID = $stateParams.departmentID;
		var busy = false;

		$scope.project = {};
		$scope.project.department_id = departmentID;

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});


		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Project.checkDuplicate($scope.project)
				.success(function(data){
					$scope.duplicate = data;
				});
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addProjectForm.$invalid){
				angular.forEach($scope.addProjectForm.$error, function(field){
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
				if(!busy){
					busy = true;
					Project.store($scope.project)
						.success(function(data){
							if(data){
								busy = false;
								$scope.duplicate = data;
							}
							else{
								Preloader.stop();
								busy = false;
							}
						})
						.error(function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);