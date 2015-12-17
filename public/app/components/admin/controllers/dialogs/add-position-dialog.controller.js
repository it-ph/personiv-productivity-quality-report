adminModule
	.controller('addPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Project', 'Position', 'Target', function($scope, $mdDialog, Preloader, Project, Position, Target){
		var departmentID = Preloader.getDepartment();
		var projectID = Preloader.get();

		console.log(projectID);

		$scope.position = {};
		$scope.position.department_id = departmentID;
		$scope.position.project_id = projectID;

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

		$scope.productivity = [
			{
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Beginner',
			},
			{
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Experienced',
			},
		];

		$scope.quality = [
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Beginner',
			},
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Experienced',
			},
		];

		Project.show(projectID)
			.success(function(data){
				$scope.project = data;
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
					.success(function(data){
						angular.forEach($scope.productivity, function(item){
							item.position_id = data.id;
							item.department_id = departmentID;
							item.project_id = projectID;
						});

						angular.forEach($scope.quality, function(item){
							item.position_id = data.id;
							item.department_id = departmentID;
							item.project_id = projectID;
						});

						Target.store($scope.productivity)
							.success(function(){
								Target.store($scope.quality)
									.success(function(){
										// Stops Preloader
										Preloader.stop();
									});
							});

					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);