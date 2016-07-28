adminModule
	.controller('addPositionDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Project', 'Position', 'Target', function($scope, $stateParams, $mdDialog, Preloader, Project, Position, Target){
		var departmentID = $stateParams.departmentID;
		var projectID = $stateParams.projectID;
		var busy = false;

		$scope.position = {};
		$scope.position.department_id = departmentID;
		$scope.position.project_id = projectID;

		$scope.experiences = [
			{
				'experience': 'Beginner',
				// 'duration': 'less than 3 months',
			},
			{
				'experience': 'Moderately Experienced',
				// 'duration': '3 to 6 months',
			},
			{
				'experience': 'Experienced',
				// 'duration': '6 months and beyond',
			},
		];

		Project.show(projectID)
			.success(function(data){
				$scope.project = data;
				$scope.label = data.name;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			$scope.showErrors = true;
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
				if(!busy){
					busy = true;
					Position.store($scope.position)
						.success(function(data){
							angular.forEach($scope.experiences, function(item){
								item.position_id = data.id;
								item.department_id = departmentID;
								item.project_id = projectID;
							});

							Target.store($scope.experiences)
								.success(function(){
									// Stops Preloader
									Preloader.stop();
									busy = false;
								})
								.error(function(){
									Preloader.error();
									busy = false;
								});
						})
						.error(function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);