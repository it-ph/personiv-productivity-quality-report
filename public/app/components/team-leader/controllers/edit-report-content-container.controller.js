teamLeaderModule
	.controller('editReportContentContainerController', ['$scope', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', 'Approval', function($scope, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project, Approval){
		var reportID = $stateParams.reportID;
		$scope.form = {};

		$scope.hours = [
			{'value': 8.3},
			{'value': 9.1},
		];

		$scope.details = {};

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Edit Report';
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main');
		}
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';

		Performance.report(reportID)
			.success(function(data){
				$scope.performances = data;
				
				$scope.details.date_start = new Date(data[0].date_start);
				$scope.details.date_end = new Date(data[0].date_end);
				$scope.details.project_name = data[0].project_name;
				$scope.details.daily_work_hours = data[0].daily_work_hours;
				$scope.details.first_letter = data[0].first_letter;

				Position.project(data[0].project_id)
					.success(function(data){
						$scope.positions = data;
					});

				Project.department(data[0].department_id)
					.success(function(data){
						$scope.projects = data;
					});
			});

		$scope.showPositions = function(id){
			Position.project(id)
				.success(function(data){
					$scope.positions = data;
				});
		};

		$scope.checkLimit = function(idx){
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = (($scope.details.date_end - $scope.details.date_start) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimitEdit($scope.performances[idx].member_id, $scope.details)
				.success(function(data){
					$scope.performances[idx].limit = data;
				})
				.error(function(){
					$scope.performances[idx].limit = $scope.details.weekly_hours;
				});
		};

		$scope.resetMembers = function(){
			angular.forEach($scope.performances, function(item, key){
				item.hours_worked = null;
				$scope.checkLimit(key);
			});
		}

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.showErrors = true;
			if($scope.form.editReportForm.$invalid){
				angular.forEach($scope.form.editReportForm.$error, function(field){
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

				angular.forEach($scope.performances, function(item){
					item.date_start = $scope.details.date_start;
					item.date_end = $scope.details.date_end;
					item.daily_work_hours = $scope.details.daily_work_hours;
				});

				Approval.performanceEdit(reportID, $scope.performances)
					.success(function(){
						$mdToast.show(
					      	$mdToast.simple()
						        .content('Edit report has been submitted for approval.')
						        .position('bottom right')
						        .hideDelay(3000)
					    );
						$state.go('main');
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					})

				// Performance.update(reportID, $scope.performances)
				// 	.success(function(){
				// 		$mdToast.show(
				// 	      	$mdToast.simple()
				// 		        .content('Changes Saved.')
				// 		        .position('bottom right')
				// 		        .hideDelay(3000)
				// 	    );
				// 		$state.go('main');
				// 		Preloader.stop();
				// 	})
				// 	.error(function(){
				// 		Preloader.error();
				// 	});
			}
		};

	}]);