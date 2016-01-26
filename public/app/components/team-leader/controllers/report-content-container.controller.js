teamLeaderModule
	.controller('reportContentContainerController', ['$scope', '$state', '$mdDialog', '$mdToast', 'Preloader', 'Member', 'Project', 'Position', 'Performance', 'User', function($scope, $state, $mdDialog, $mdToast, Preloader, Member, Project, Position, Performance, User){		
		var user = Preloader.getUser();
		var departmentID = null;
		$scope.form = {};

		if(!user){
			User.index()
				.success(function(data){
					$scope.user = data;
					departmentID = data.department_id;
					Member.updateTenure(data.id)
						.success(function(){					
							Member.teamLeader(data.id)
								.success(function(data){
									$scope.members = data;
								});
						})
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
			if($scope.form.createReportForm.$invalid){
				angular.forEach($scope.form.createReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.body))
						.clickOutsideToClose(true)
				        .title('Error')
				        .content('Please complete the forms or check the errors.')
				        .ariaLabel('Error')
				        .ok('Got it!')
				);
			}
			else{
				Preloader.preload();

				angular.forEach($scope.members, function(item){
					item.department_id = departmentID;
					item.date_start = $scope.details.date_start;
					item.date_end = $scope.details.date_end;
					item.project_id = $scope.details.project_id;
					item.daily_work_hours = $scope.details.daily_work_hours;
				});

				Performance.store($scope.members)
					.success(function(){
						$mdToast.show(
					      	$mdToast.simple()
						        .content('Report Submitted.')
						        .position('bottom right')
						        .hideDelay(3000)
					    );
						$state.go('main');
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		};

		$scope.checkLimit = function(idx){
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = (($scope.details.date_end - $scope.details.date_start) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimit($scope.members[idx].id, $scope.details)
				.success(function(data){
					$scope.members[idx].limit = data;
				})
				.error(function(){
					$scope.members[idx].limit = $scope.details.weekly_hours;
				});
		};

		$scope.resetMembers = function(){
			// $scope.checkLimit();
			angular.forEach($scope.members, function(item, key){
				item.hours_worked = null;
				$scope.checkLimit(key);
			});
		}
	}]);