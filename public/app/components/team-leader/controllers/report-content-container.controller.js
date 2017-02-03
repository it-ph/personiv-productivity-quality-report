teamLeaderModule
	.controller('reportContentContainerController', ['$scope', '$filter', '$state', '$mdDialog', '$mdToast', 'Preloader', 'Member', 'Project', 'Position', 'Performance', 'User', 'Programme', 'Experience', function($scope, $filter, $state, $mdDialog, $mdToast, Preloader, Member, Project, Position, Performance, User, Programme, Experience){		
		var user = Preloader.getUser();
		// var departmentID = null;
		var busy = false;
		$scope.form = {};

		$scope.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		
		$scope.years = [];
		
		var dateCreated = 2016;

		// will generate the dates that will be used in drop down menu
		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.details = {};
		$scope.details.date_start_month = $scope.months[new Date().getMonth()];
		$scope.details.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.details.date_end = null;
			$scope.details.date_start = null;
			$scope.details.weekend = [];
			// $scope.details.project_id = null;
			Performance.getMondays($scope.details)
				.success(function(data){
					$scope.mondays = data;
					$scope.show = true;
					return;
				})
				.error(function(){
					Preloader.error();
				});

		};

		$scope.getWeekends = function(){
			// $scope.details.project_id = null;	
			$scope.details.date_end = null;	
			$scope.details.weekend = [];
			Performance.getWeekends($scope.details)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.setDefaultPosition = function(){
			angular.forEach($scope.members, function(member){
				if(!member.output && !member.hours_worked){
					member.position_id = $scope.details.position_id;
					$scope.getTarget(member);
				}
			});
		}

		$scope.showPositions = function(projectID){
			$scope.toolbar.items = [];
			Position.project(projectID)
				.success(function(data){
					$scope.positions = data;
				});

			Experience.members(projectID)
				.success(function(data){
					$scope.members = data;
					$scope.resetMembers();
				});

			Project.show(projectID)
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
		};

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
		$scope.toolbar.childState = 'Report';
		// $scope.toolbar.hideSearchIcon = true;
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'report';

		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		}

		/**
		 * Status of search bar.
		 *
		*/
		$scope.searchBar = false;

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
		 * Object for content view
		 *
		*/
		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;

		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.showErrors = true;
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
				if(!busy){
					busy = true;
					var count = 0;
					angular.forEach($scope.members, function(item){
						// item.department_id = departmentID;
						item.date_start = $scope.details.date_start;
						item.date_end = $scope.details.date_end;
						item.project_id = $scope.details.project_id;
						item.daily_work_hours = $scope.details.daily_work_hours;
						count = item.include ? count + 1 : count;
					});

					if(count){
						Preloader.preload();
						Performance.store($scope.members)
							.success(function(){
								$mdToast.show(
							      	$mdToast.simple()
								        .content('Report Submitted.')
								        .position('bottom right')
								        .hideDelay(3000)
							    );
								Preloader.stop();
								$state.go('main');
								busy = false;
							})
							.error(function(){
								Preloader.error();
								busy = false;
							});
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

		$scope.checkLimit = function(data){
			// console.log(data);
			var idx = $scope.members.indexOf(data);
			// console.log(idx);
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			// $scope.details.weekly_hours = ((new Date($scope.details.date_end) - new Date($scope.details.date_start)) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimit($scope.members[idx].member.id, $scope.details)
				.success(function(data){
					$scope.members[idx].limit = data;
					// if($scope.reset){
					// 	$scope.count++;
					// 	// console.log($scope.count, $scope.members.length);
					// 	if($scope.count == $scope.members.length){
					// 		$scope.showMembers = true;
					// 		$scope.reset = false;
					// 	}
					// }
				})
				.error(function(){
					$scope.members[idx].limit = $scope.details.weekly_hours;
				});
		};

		$scope.resetMembers = function(){
			$scope.details.weekly_hours = ((new Date($scope.details.date_end) - new Date($scope.details.date_start)) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			// $scope.count = 0;
			$scope.showMembers = false;
			// $scope.reset = true;
			// $scope.checkLimit();
			angular.forEach($scope.members, function(item, key){
				item.hours_worked = null;
				item.date_start = $scope.details.date_start;
				item.date_end = $scope.details.date_end;
				item.daily_work_hours = $scope.details.daily_work_hours;
				item.weekly_hours = $scope.details.weekly_hours;
				// $scope.checkLimit(item);
			});

			Performance.checkLimitAll($scope.members)
				.success(function(data){
					angular.forEach(data, function(item){
						item.date_started = new Date(item.date_started);
						item.first_letter = item.member.full_name.charAt(0).toUpperCase();
						item.output_error = 0;

						var toolbarItem = {};
						toolbarItem.display = item.member.full_name;
						$scope.toolbar.items.push(toolbarItem);
					});


					$scope.members = data;
					$scope.showMembers = true;
					// $scope.reset = false;
				})
		}

		$scope.checkBalance = function(data){
			var index = $scope.members.indexOf(data);
			$scope.members[index].balance = $scope.members[index].limit - $scope.members[index].hours_worked;
			$scope.members[index].balance = $scope.members[index].balance ? $scope.members[index].balance.toFixed(2) : 0;
		}

		// $scope.checkProgramme = function(idx){
		// 	$scope.details.programme_id = $scope.work_hours[idx].id;
		// }

		$scope.getTarget = function(member){
			var index = $scope.members.indexOf(member);
			var position = $filter('filter')($scope.project.positions, {id:member.position_id});
			var target = $filter('filter')(position[0].targets, {experience:member.experience}, true);
			$scope.members[index].target_id = target[0].id;
			if(member.member_id == 21)
			{
				console.log(target);
			}
		}

		// $scope.markInclude = function(member){
		// 	if(member.limit){
		// 		member.include = member.include ? false : true;
		// 	}
		// }

		$scope.init = function(refresh){
			Member.updateTenure()
				.then(function(){
					return;					
				})
				.then(function(){
					Project.index()
						.success(function(data){
							$scope.projects = data;
							return;
						})
						.error(function(){
							Preloader.error();
						})
				})
				.then(function(){		
					Programme.index()
						.success(function(data){
							$scope.work_hours = data;
							return;
						})
				})
				.then(function(){
					$scope.getMondays();

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				}, function(){
					Preloader.error();
				})
		};

		$scope.init();
	}]);