adminModule
	.controller('editPositionDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Project', 'Position', 'Target',  function($scope, $stateParams, $mdDialog, Preloader, Project, Position, Target){
		var departmentID = $stateParams.departmentID;
		var projectID = $stateParams.projectID;
		var positionID = Preloader.get();
		var busy = false;

		// $scope.position = {};
		// $scope.position.department_id = departmentID;
		// $scope.position.project_id = projectID;

		Position.show(positionID)
			.success(function(data){
				$scope.position = data;
			})
			.error(function(){
				Preloader.error();
			})


		$scope.experiences = [
			{
				'name': 'Beginner',
				'duration': 'less than 3 months',
			},
			{
				'name': 'Moderately Experienced',
				'duration': '3 to 6 months',
			},
			{
				'name': 'Experienced',
				'duration': '6 months and beyond',
			},
		];

		Target.productivity(positionID)
			.success(function(data){
				$scope.productivity = data;
			});

		Target.quality(positionID)
			.success(function(data){
				$scope.quality = data;
			});

		Project.show(projectID)
			.success(function(data){
				$scope.project = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.editPositionForm.$invalid){
				angular.forEach($scope.editPositionForm.$error, function(field){
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
					Position.update(positionID, $scope.position)
						.success(function(data){
							Target.update(positionID, $scope.productivity)
								.success(function(){
									Target.update(positionID, $scope.quality)
										.success(function(){
											// Stops Preloader
											Preloader.stop();
										})
										.error(function(data){
											Preloader.error();
										});
								})
								.error(function(){
									Preloader.error();
								});

							busy = false;
						})
						.error(function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);