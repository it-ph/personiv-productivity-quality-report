teamLeaderModule
	.controller('editReportContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', 'Approval', function($scope, $filter, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project, Approval){
		var reportID = $stateParams.reportID;
		var busy = false;
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
			$state.go('main.weekly-report');
		}

		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.toolbar.userInput = '';
			$scope.searchBar = false;
		};

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';

		Performance.report(reportID)
			.success(function(data){
				angular.forEach(data, function(performance){
					var experience = $filter('filter')(performance.member.experiences, {project_id: performance.project_id}, true);
					performance.date_started = new Date(experience[0].date_started);
					performance.experience = experience[0].experience;
				});

				$scope.performances = data;
				
				$scope.details.date_start = new Date(data[0].date_start);
				$scope.details.date_end = new Date(data[0].date_end);
				$scope.details.project_name = data[0].project.name;
				$scope.details.daily_work_hours = data[0].daily_work_hours;
				$scope.details.first_letter = data[0].project.name.charAt(0).toUpperCase();
				$scope.details.weekly_hours = (($scope.details.date_end - $scope.details.date_start) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
				$scope.details.date_start = $scope.details.date_start.toDateString();
				$scope.details.date_end = $scope.details.date_end.toDateString();

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

		$scope.checkLimit = function(data){
			var idx = $scope.performances.indexOf(data);
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.current_hours_worked = $scope.performances[idx].hours_worked;
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
				$scope.checkLimit(item);
			});
		}

		$scope.checkBalance = function(data){
			var index = $scope.performances.indexOf(data);
			$scope.performances[index].balance = $scope.performances[index].limit - $scope.performances[index].hours_worked;
			$scope.performances[index].balance = $scope.performances[index].balance ? $scope.performances[index].balance.toFixed(2) : 0;
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

				if(!busy){
					busy = true;
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
							busy = false;
						})
						.error(function(){
							Preloader.error();
							busy = false;
						})
				}
			}
		};

	}]);