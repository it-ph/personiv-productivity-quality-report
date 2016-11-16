teamLeaderModule
	.controller('editReportContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', 'PerformanceHistory', function($scope, $filter, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project, PerformanceHistory){
		var reportID = $stateParams.reportID;
		var busy = false;
		$scope.form = {};

		// $scope.hours = [
		// 	{'value': 8.3},
		// 	{'value': 9.1},
		// ];

		$scope.details = {};

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.items = [];
		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}
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

		$scope.deletePerformance = function(performance){
			 var confirm = $mdDialog.confirm()
		        .title('Delete performance')
		        .textContent('This performance will be deleted permanently. If you would just change something you can edit this instead.')
		        .ariaLabel('Delete performance')
		        .ok('Delete')
		        .cancel('Cancel');

		    $mdDialog.show(confirm).then(function() {
		    	Preloader.preload();
		    	var idx = $scope.performances.indexOf(performance);
		    	Performance.delete(performance.id)
		    		.success(function(){
		    			$scope.performances.splice(idx, 1);
		    			Preloader.stop();
		    		})
		    }, function() {
		    	return;
		    });
		}

		Performance.report(reportID)
			.success(function(data){
				angular.forEach(data, function(performance){
					var experience = $filter('filter')(performance.member.experiences, {project_id: performance.project_id}, true);
					performance.date_started = new Date(experience[0].date_started);
					performance.experience = performance.target.experience;

					var item = {};
					item.display = performance.member.full_name;
					$scope.toolbar.items.push(item);
					performance.first_letter = performance.member.full_name.charAt(0).toUpperCase();
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

				// Position.project(data[0].project_id)
				// 	.success(function(data){
				// 		$scope.positions = data;
				// 	});

				Project.show(data[0].project_id)
					.success(function(data){
						$scope.project = data;
						angular.forEach(data.positions, function(position){
							var targets = [];
							var index = 0;
							angular.forEach(position.targets, function(target){
								var target_created_at = new Date(target.created_at).setHours(0,0,0,0);
								if(!target.deleted_at && target_created_at <= new Date($scope.details.date_start)){
									targets.splice(index, 0, target);
									index++;
								}
								else if(target.deleted_at && target_created_at < new Date($scope.details.date_start)){
									targets.splice(index, 0, target);
									index++;
								}
							});

							if(targets.length){
								$scope.default = 'false';
								var beginner_productivity = $filter('filter')(targets, {experience:'Beginner'}, true);
								var moderately_experienced_productivity = $filter('filter')(targets, {experience:'Moderately Experienced'}, true);
								var experienced_productivity = $filter('filter')(targets, {experience:'Experienced'}, true);
								var quality = $filter('filter')(targets, {experience:'Experienced'}, true);
							}
							else{
								$scope.default = 'true';
								var beginner_productivity = $filter('filter')(position.targets, {experience:'Beginner', deleted_at:null}, true);
								var moderately_experienced_productivity = $filter('filter')(position.targets, {experience:'Moderately Experienced', deleted_at:null}, true);
								var experienced_productivity = $filter('filter')(position.targets, {experience:'Experienced', deleted_at:null}, true);
								var quality = $filter('filter')(position.targets, {experience:'Experienced', deleted_at:null}, true);							
							}

							position.targets = [];
							position.targets.push(beginner_productivity[0]);
							position.targets.push(moderately_experienced_productivity[0]);
							position.targets.push(experienced_productivity[0]);
							
						});
					});

				Project.department(data[0].department_id)
					.success(function(data){
						$scope.projects = data;
					});
			})
			.error(function(){
				$state.go('page-not-found');
			});

		// $scope.showPositions = function(id){
		// 	Position.project(id)
		// 		.success(function(data){
		// 			$scope.positions = data;
		// 		});
		// };

		$scope.checkAllPerformance = function(){
			angular.forEach($scope.performances, function(performance){
				performance.weekly_hours = $scope.details.weekly_hours;
				if(performance.include){
					performance.include = false;
					$scope.checkLimitAll = false;
				}
				else{
					performance.include = true;
					$scope.checkLimitAll = true;
					// $scope.checkLimit(performance);
				}

				if($scope.checkLimitAll){
					Performance.checkLimitEditAll($scope.performances)
						.success(function(data){
							$scope.performances = data;
						})
				}

			});
		}

		$scope.checkLimit = function(data){
			var idx = $scope.performances.indexOf(data);
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.current_hours_worked = data.hours_worked;
			Performance.checkLimitEdit($scope.performances[idx].member_id, $scope.details)
				.success(function(data){
					$scope.performances[idx].limit = data;
				})
				.error(function(){
					$scope.performances[idx].limit = $scope.details.weekly_hours;
				});

			$scope.getTarget(data);
		};

		$scope.resetMembers = function(){
			angular.forEach($scope.performances, function(item, key){
				item.hours_worked = null;
				$scope.checkLimit(item);
			});
		}

		$scope.getTarget = function(performance){
			var index = $scope.performances.indexOf(performance);
			var position = $filter('filter')($scope.project.positions, {id:performance.position_id});
			var target = $filter('filter')(position[0].targets, {experience:performance.experience}, true);
			$scope.performances[index].target_id = target[0].id;
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
					var count = 0;
					angular.forEach($scope.performances, function(item){
						item.date_start = $scope.details.date_start;
						item.date_end = $scope.details.date_end;
						item.daily_work_hours = $scope.details.daily_work_hours;
						count = item.include ? count + 1 : count;
					});
					if(count){
						PerformanceHistory.store($scope.performances)
							.success(function(){
								Performance.update(reportID, $scope.performances)
									.success(function(){
										$mdToast.show(
									      	$mdToast.simple()
										        .content('Changes saved.')
										        .position('bottom right')
										        .hideDelay(3000)
									    );
										$scope.toolbar.back();
										Preloader.stop();
										busy = false;
									})
									.error(function(){
										Preloader.error();
									})
							})
							.error(function(){
								Preloader.error();
								busy = false;
							})
					}
					else{
						$mdDialog.show(
							$mdDialog.alert()
								.parent(angular.element(document.body))
								.clickOutsideToClose(true)
						        .title('Report not submitted.')
						        .content('Empty reports are not submitted.')
						        .ariaLabel('Empty Report')
						        .ok('Got it!')
						);
					}
				}
			}
		};

	}]);