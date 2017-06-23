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
				$scope.position.effective_date = new Date(data.targets[0].effective_date);
				$scope.label = data.project.name;

				$scope.experiences = data.targets;
			})
			.error(function(){
				Preloader.error();
			})


		$scope.experiences = [
			{
				'experience': 'Beginner',
				'duration': 'less than 3 months',
			},
			{
				'experience': 'Moderately Experienced',
				'duration': '3 to 6 months',
			},
			{
				'experience': 'Experienced',
				'duration': '6 months and beyond',
			},
		];

		// Target.productivity(positionID)
		// 	.success(function(data){
		// 		$scope.productivity = data;
		// 	});

		// Target.quality(positionID)
		// 	.success(function(data){
		// 		$scope.quality = data;
		// 	});

		// Project.show(projectID)
		// 	.success(function(data){
		// 		$scope.project = data;
		// 	});

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Position.checkDuplicate($scope.position)
				.success(function(data){
					$scope.duplicate = data;
				});
		}

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
				// Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy && !$scope.duplicate){
					angular.forEach($scope.experiences, function(experience){
						experience.effective_date = $scope.position.effective_date.toDateString();
					});					

					busy = true;
					Position.update(positionID, $scope.position)
						.success(function(data){
							if(typeof(data) === 'boolean'){
								busy = false;
								$scope.duplicate = data;
							}
							else{
								Target.update(positionID, $scope.experiences)
									.success(function(){
										// Stops Preloader
										busy = false;
										Preloader.stop();
									})
									.error(function(){
										busy = false;
										Preloader.error();
									});

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