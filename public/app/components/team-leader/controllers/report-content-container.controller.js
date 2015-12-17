teamLeaderModule
	.controller('reportContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Member', 'Project', 'Position', 'User', function($scope, $mdDialog, Preloader, Member, Project, Position, User){		
		var user = Preloader.getUser();
		var departmentID = null;

		if(!user){
			User.index()
				.success(function(data){
					$scope.user = data;
					departmentID = data.department_id;
					Member.teamLeader(data.id)
						.success(function(data){
							$scope.members = data;
						});
					Project.department(departmentID)
						.success(function(data){
							$scope.projects = data;
						})
				});
		}
		else{		
			departmentID = user.department_id;
			Member.teamLeader(user.id)
				.success(function(data){
					$scope.members = data;
				});
			Project.department(user.department_id)
				.success(function(data){
					$scope.projects = data;
				})
		}

		$scope.details = {};


		$scope.showPositions = function(id){
			Position.project(id)
				.success(function(data){
					$scope.positions = data;
				});
		};

		$scope.hours = [
			{'value': 8.3},
			{'value': 9.1},
		];
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Report';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			console.log($scope.createReportForm)
			if($scope.createReportForm.$invalid){
				angular.forEach($scope.createReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				angular.forEach($scope.members, function(item){
					item.department_id = departmentID;
					item.date_start = $scope.details.date_start;
					item.date_end = $scope.details.date_end;
					item.project_id = $scope.details.project_id;
					item.daily_work_hours = $scope.details.daily_work_hours;
				});
			}
		};

		$scope.submit = function(){
			console.log($scope.createReportForm);
			// if($scope.createReportForm.$invalid){
			// 	angular.forEach($scope.createReportForm.$error, function(field){
			// 		angular.forEach(field, function(errorField){
			// 			errorField.$setTouched();
			// 		});
			// 	});
			// }
			// else{
			// 	angular.forEach($scope.members, function(item){
			// 		item.department_id = departmentID;
			// 		item.date_start = $scope.details.date_start;
			// 		item.date_end = $scope.details.date_end;
			// 		item.project_id = $scope.details.project_id;
			// 		item.daily_work_hours = $scope.details.daily_work_hours;
			// 	});
			// }
		}
	}]);