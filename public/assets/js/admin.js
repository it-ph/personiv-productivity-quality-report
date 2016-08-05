var adminModule = angular.module('adminModule', [
	/* Shared Module */
	'sharedModule'
]); 
adminModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url:'/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'toolbar@main': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/components/admin/templates/content/main.content.template.html'
					},
					'right-sidenav@main': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-right.sidenav.html',
					},
				}
			})
			.state('main.weekly-report', {
				url: 'weekly-report/{departmentID}',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'departmentContentContainerController',
					},
					'toolbar@main.weekly-report': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.weekly-report': {
						templateUrl: '/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				}
			})
			.state('main.work-hours', {
				url:'work-hours',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'workHoursContentContainerController',
					},
					'toolbar@main.work-hours': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.work-hours':{
						templateUrl: '/app/components/admin/templates/content/work-hours.content.template.html',
					},
				},
			})
			.state('main.team-leaders', {
				url:'team-leaders',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'teamLeaderContentContainerController',
					},
					'toolbar@main.team-leaders': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.team-leaders':{
						templateUrl: '/app/components/admin/templates/content/settings.content.template.html',
					},
				},
			})
			.state('main.department-settings', {
				url:'department-settings',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'departmentSettingsContentContainerController',
					},
					'toolbar@main.department-settings': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.department-settings':{
						templateUrl: '/app/components/admin/templates/content/settings.content.template.html',
					},
				},
			})
			.state('main.projects',{
				url: 'department-settings/{departmentID}/projects',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'projectsContentContainerController',
					},
					'toolbar@main.projects': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.projects':{
						templateUrl: '/app/components/admin/templates/content/projects.content.template.html',
					},
				}
			})
			.state('main.positions',{
				url: 'department-settings/{departmentID}/project/{projectID}',
				params: {'departmentID':null, 'projectID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'positionsContentContainerController',
					},
					'toolbar@main.positions': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.positions':{
						templateUrl: '/app/components/admin/templates/content/positions.content.template.html',
					},
				}
			})
			.state('main.edit-report',{
				url:'edit-report/{reportID}',
				params: {'reportID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'editReportContentContainerController',
					},
					'toolbar@main.edit-report': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.edit-report':{
						templateUrl: '/app/shared/templates/content/edit-report.content.template.html',
					},
				}
			})
			.state('main.approvals',{
				url:'approvals',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/app/shared/templates/content/approval.content.template.html',
					},
				}
			})
	}]);
adminModule
	.controller('approvalsContentContainerController', ['$scope', '$state', '$mdDialog', 'PerformanceApproval', 'Approval', 'Preloader',  function($scope, $state, $mdDialog, PerformanceApproval, Approval, Preloader){
		$scope.form = {};
		$scope.approval = {};
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
		var dateCreated = 2016;

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.approval.month = $scope.months[new Date().getMonth()];
		$scope.approval.year = new Date().getFullYear();
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.hideSearchIcon = true;
		$scope.toolbar.childState = 'Approvals';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'approvals';
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		}


		$scope.showPending = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvalsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approval.dialog.template.html',
		      parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    	// $state.go($state.current, {}, {reload:true});
		    });
		}

		$scope.showApprovedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    });
		}

		$scope.showDeclinedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'declinedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    });
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

		$scope.search = function(){
			Preloader.preload();
			/* Pending */
			Approval.pending($scope.approval)
				.success(function(data){
					$scope.pendingApprovals = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Approved */
			PerformanceApproval.approved($scope.approval)
				.success(function(data){
					$scope.approved = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Declined */
			PerformanceApproval.declined($scope.approval)
				.success(function(data){
					$scope.declined = data;
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});

		}

		$scope.init = function(refresh){
			/* Pending */
			Approval.pending()
				.success(function(data){
					$scope.pendingApprovals = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Approved */
			PerformanceApproval.approved()
				.success(function(data){
					$scope.approved = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Declined */
			PerformanceApproval.declined()
				.success(function(data){
					$scope.declined = data;
					if(refresh){
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});

		}

		$scope.init();
	}]);
adminModule
	.controller('departmentContentContainerController', ['$scope', '$filter', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Member', 'Position', 'Department', 'Report', 'Performance', 'Target', 'User', 'Project', function($scope, $filter, $state, $stateParams, $mdDialog, Preloader, Member, Position, Department, Report, Performance, Target, User, Project){
		var departmentID = $stateParams.departmentID;

		Project.department(departmentID)
			.success(function(data){
				$scope.projects = data;
			});

		$scope.filterDate = {};
		$scope.filterData = {};
		$scope.filterDate.type = 'Weekly';

		$scope.rightSidenav = {};

		$scope.rightSidenav.show = true;
		$scope.rightSidenav.items = [];
		$scope.rightSidenav.queryMember = function(query){
			var results = query ? $filter('filter')($scope.rightSidenav.items, query) : $scope.rightSidenav.items;
			return results;
		}

		Member.department(departmentID)
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

		Position.department(departmentID)
			.success(function(data){
				$scope.positions = data;
			});

		$scope.months = [
			{'value': '01', 'month': 'January'},
			{'value': '02', 'month': 'February'},
			{'value': '03', 'month': 'March'},
			{'value': '04', 'month': 'April'},
			{'value': '05', 'month': 'May'},
			{'value': '06', 'month': 'June'},
			{'value': '07', 'month': 'July'},
			{'value': '08', 'month': 'August'},
			{'value': '09', 'month': 'September'},
			{'value': '10', 'month': 'October'},
			{'value': '11', 'month': 'November'},
			{'value': '12', 'month': 'December'},
		];

		$scope.months_array = [
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
		
		var dateCreated = 2015;

		// will generate the dates that will be used in drop down menu
		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.filterDate.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.filterDate.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.filterDate.date_end = null;
			$scope.filterDate.date_start = null;
			$scope.filterDate.weekend = [];
			Performance.getMondays($scope.filterDate)
				.success(function(data){
					$scope.mondays = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getWeekends = function(){	
			$scope.filterDate.date_end = null;	
			$scope.filterDate.weekend = [];
			Performance.getWeekends($scope.filterDate)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.clearFilter = function(){
			$scope.subheader.project = '';
			$scope.filterDate.date_start = '';
			$scope.filterDate.date_end = '';
			$scope.filterData.position = '';
		}
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Weekly Report';
		$scope.toolbar.hideSearchIcon = true;

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;
		$scope.subheader.state = 'department';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.report.show = false;
			$scope.init(true);
		};
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
			Preloader.preload();
			Report.searchDepartment(departmentID, $scope.filterDate)
				.success(function(data){
					$scope.report.results = data;
					angular.forEach(data, function(item){
						pushItem(item);
					});
					
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		// $scope.show = function(id){
		// 	$state.go('main.units', {'assetID': $stateParams.assetID, 'unitID':id});
		// };
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	return;
		// };

		$scope.show = function(data){
			Preloader.set(data);
			$mdDialog.show({
		    	controller: 'otherPerformanceDialogController',
		      	templateUrl: '/app/shared/templates/dialogs/other-performance.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true,
		    });
		}

		$scope.editReport = function(id){
			$state.go('main.edit-report', {'reportID':id});
		};

		$scope.deleteReport = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Report')
		        .content('Are you sure you want to delete this report?')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		    	Report.delete(id)
		    		.success(function(){
		    			$scope.subheader.refresh();
		    		})
		    }, function() {
		    	return;
		    });
		}

		var pushItem = function(report){
			report.date_start = new Date(report.date_start);
			report.date_end = new Date(report.date_end);

			angular.forEach(report.performances, function(performance){
				var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
				performance.experience = filter[0].experience;
			});

			// Targets
			report.project.beginner = [];
			report.project.moderately_experienced = [];
			report.project.experienced = [];
			report.project.quality = [];

			angular.forEach(report.project.positions, function(position){
				angular.forEach(position.targets, function(target){
					var index = 0;
					if(target.deleted_at && new Date(target.created_at) < report.date_start){
						position.targets.splice(index, 0, target);
					}
					else if(!target.deleted_at){
						position.targets.splice(index, 0, target);
					}
				})

				var beginner_productivity = $filter('filter')(position.targets, {experience:'Beginner'}, true);
				var moderately_experienced_productivity = $filter('filter')(position.targets, {experience:'Moderately Experienced'}, true);
				var experienced_productivity = $filter('filter')(position.targets, {experience:'Experienced'}, true);
				var quality = $filter('filter')(position.targets, {experience:'Experienced'}, true);

				report.project.beginner.push(beginner_productivity[0].productivity);
				report.project.moderately_experienced.push(moderately_experienced_productivity[0].productivity);
				report.project.experienced.push(experienced_productivity[0].productivity);
				report.project.quality.push(quality[0].quality);
			}) 

			// Charts
			report.chartType = 'bar';
			report.charts = {};
									
			report.charts.productivity = {};
			report.charts.productivity.data = [[]];
			report.charts.productivity.series = ['Productivity'];
			report.charts.productivity.labels = [];
			
			report.charts.quality = {};
			report.charts.quality.data = [[]];
			report.charts.quality.series = ['Quality'];
			report.charts.quality.labels = [];

			angular.forEach(report.performances, function(performance, key){
				report.charts.productivity.data[0].push(performance.productivity);
				report.charts.quality.data[0].push(performance.quality);
				report.charts.productivity.labels.push(performance.member.full_name);
				report.charts.quality.labels.push(performance.member.full_name);
			});

			return report;
		}

		$scope.init = function(refresh){
			Department.show(departmentID)
				.success(function(data){
					$scope.toolbar.childState = data.name;
					$scope.projects = data.projects;
					angular.forEach(data.members, function(item){
						var member = {};
						member.full_name = item.full_name;
						$scope.rightSidenav.items.push(member);
					});
				});

			// Member.index()
			// 	.success(function(data){
			// 		angular.forEach(data, function(item){
			// 			var member = {};
			// 			member.full_name = item.full_name;
			// 			$scope.rightSidenav.items.push(member);
			// 		});
			// 	})

			Position.department(departmentID)
				.success(function(data){
					$scope.positions = data;
				});

			// Project.index()
			// 	.success(function(data){
			// 		$scope.projects = data;
			// 	});

			$scope.getMondays();
			/**
			 * Object for report
			 *
			*/
			$scope.report = {};
			$scope.report.paginated = [];
			// 2 is default so the next page to be loaded will be page 2 
			$scope.report.page = 2;

			Report.paginateDepartmentDetails(departmentID)
				.success(function(data){
					$scope.report.details = data;
					$scope.report.paginated = data.data;
					$scope.report.show = true;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(data){
							pushItem(data);
						});
					}

					// 	$scope.fab.show = true;
					// }

					$scope.report.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.report.busy || ($scope.report.page > $scope.report.details.last_page)){
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.report.busy = true;

						Report.paginateDepartmentDetails(departmentID, $scope.report.page)
							.success(function(data){
								// increment to call the next page for the next call
								$scope.report.page++;
								// iterate over the paginated data and push it to the original array
								angular.forEach(data.data, function(data){
									pushItem(data);
									$scope.report.paginated.push(data);
								});
								// enables next call
								$scope.report.busy = false;
							})
							.error(function(){
								Preloader.error();
							});
				}
				if(refresh){
					Preloader.stop();
					Preloader.stop();
				}
			})
			.error(function(){
				Preloader.error();
			})
		}

		$scope.init();
	}]);
adminModule
	.controller('departmentSettingsContentContainerController', ['$scope', '$state', '$mdDialog', 'Preloader', 'Department', function($scope, $state, $mdDialog, Preloader, Department){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Departments';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'settings';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear department
			$scope.init(true);
		};

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
			$scope.toolbar.searchText = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.setting.all.show = false;
			Preloader.preload()
			Department.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			$state.go('main.projects', {'departmentID':id});
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Department';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    		controller: 'addDepartmentDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-department.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

		$scope.init = function(refresh){
			/**
			 * Object for setting
			 *
			*/
			$scope.setting = {};
			Department.index()
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.setting.all = data;
					$scope.setting.all.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				});
		}

		$scope.init();
	}]);
adminModule
	.controller('editReportContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', function($scope, $filter, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project){
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
				$scope.checkLimit(key);
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
				busy = true;
				Preloader.preload();

				if(busy){
					angular.forEach($scope.performances, function(item){
						item.date_start = $scope.details.date_start;
						item.date_end = $scope.details.date_end;
						item.project_id = $scope.details.project_id;
						item.daily_work_hours = $scope.details.daily_work_hours;
					});

					Performance.update(reportID, $scope.performances)
						.success(function(){
							$mdToast.show(
						      	$mdToast.simple()
							        .content('Changes Saved.')
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
						});
				}
			}
		};

	}]);
adminModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'Department', function($scope, $mdSidenav, Department){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Weekly Report',
			},
			{
				'name':'Settings',
			},
		];

		$scope.menu.settings = [
			{
				'name':'Departments',
				'state':'main.department-settings',
			},
			{
				'name':'User Accounts',
				'state':'main.team-leaders',
			},
			{
				'name':'Work hours',
				'state':'main.work-hours',
			},
		],

		/* AJAX Request Department */
		Department.index()
			.success(function(data){
				$scope.menu.departments =  data;
			});

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);
adminModule
	.controller('mainContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Report', 'User', 'Target', 'Programme', function($scope, $state, $stateParams, $mdDialog, Preloader, Report, User, Target, Programme){
		$scope.report = {};
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
		var dateCreated = 2016;

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			});

		$scope.currentMonth = $scope.months[new Date().getMonth()];

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Dashboard';
		$scope.toolbar.hideSearchIcon = true;
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;
		$scope.subheader.state = 'dashboard';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		};

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
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
		
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
		};

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	return;
		// };

		// $scope.rightSidenav = {};

		// $scope.rightSidenav.show = true;

		$scope.init = function(refresh){
			Report.monthly()
				.success(function(data){
					angular.forEach(data, function(report){
						report.chart = {};
						report.chart.series = ['Productivity', 'Quality'];
						report.chart.data = [[],[]];
						report.chart.labels = [];

						report.date_start = new Date(report.date_start);
						report.count = 0;
						angular.forEach(report.members, function(member){
							if(!member.member.deleted_at){
								report.count++;
							}
							if(member.average_productivity && member.average_productivity){
								report.chart.data[0].push(member.average_productivity);
								report.chart.data[1].push(member.average_quality);
								report.chart.labels.push(member.member.full_name);
							}
						});
					});
					
					$scope.reports = data;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				})
		}


		$scope.form = {};

		$scope.searchMonthlyReport = function(){
			if($scope.form.searchMonthlyForm.$invalid){
				angular.forEach($scope.form.searchMonthlyForm.$error, function(field){
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
				Report.searchMonthly($scope.report)
					.success(function(data){
						angular.forEach(data, function(report){
							report.chart = {};
							report.chart.series = ['Productivity', 'Quality'];
							report.chart.data = [[],[]];
							report.chart.labels = [];

							report.date_start = new Date(report.date_start);
							
							angular.forEach(report.members, function(member){
								if(member.average_productivity && member.average_productivity){
									report.chart.data[0].push(member.average_productivity);
									report.chart.data[1].push(member.average_quality);
									report.chart.labels.push(member.member.full_name);
								}
							});
						});
						
						$scope.reports = data;
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					})
			}
		}

		$scope.view = function(data, dateStart, dateEnd){
			data.date_start = dateStart;
			data.date_end = dateEnd;
			Preloader.set(data);
			$mdDialog.show({
		    	controller: 'performanceMonthlyViewDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true,
		    });
		}

		$scope.init();
	}]);
adminModule
	.controller('positionsContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Department', 'Preloader', 'Project', 'Position', function($scope, $state, $stateParams, $mdDialog, Department, Preloader, Project, Position){
		/**
		 * Object for toolbar
		 *
		*/
		var department_id = $stateParams.departmentID;
		var project_id = $stateParams.projectID;
		
		$scope.position = {};

		$scope.toolbar = {};
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.projects', {'departmentID':department_id});
		}
		
		Department.show(department_id)
			.success(function(data){
				$scope.toolbar.parentState = data.name;
			});

		Project.show(project_id)
			.success(function(data){
				$scope.toolbar.childState = data.name;
			})
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'positions';

		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		}

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Position';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
		    	controller: 'addPositionDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

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
			$scope.toolbar.searchText = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.project.show = false;
			Preloader.preload()
			Position.search($scope.toolbar)
				.success(function(data){
					$scope.project.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.viewProject = function(id){
			$state.go('main.positions', {'departmentID':department_id, 'projectID':id});
		}

		$scope.edit = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'editPositionDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    });
		}

		$scope.init = function(refresh){
			$scope.position = {};
			Position.project(project_id)
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.position.all = data;
					$scope.position.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.init();
	}])
adminModule
	.controller('projectsContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Department', 'Preloader', 'Project', function($scope, $state, $stateParams, $mdDialog, Department, Preloader, Project){
		/**
		 * Object for toolbar
		 *
		*/
		var department_id = $stateParams.departmentID;

		$scope.toolbar = {};
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.department-settings');
		}
		
		Department.show(department_id)
			.success(function(data){
				$scope.toolbar.parentState = data.name;
			});

		$scope.toolbar.childState = 'Projects';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'projects';

		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
		}

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Project';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
			    	controller: 'addProjectDialogController',
			      	templateUrl: '/app/components/admin/templates/dialogs/add-project.dialog.template.html',
			      	parent: angular.element(document.body),
			    })
			    .then(function(){
			    	$scope.subheader.refresh();
			    })
		};

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
			$scope.toolbar.searchText = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.project.show = false;
			Preloader.preload()
			Project.search($scope.toolbar)
				.success(function(data){
					$scope.project.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.viewProject = function(id){
			$state.go('main.positions', {'departmentID':department_id, 'projectID':id});
		};

		$scope.viewTarget = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'showTargetsDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose: true,
		    });
		};

		$scope.init = function(refresh){
			$scope.project = {};
			Project.department(department_id)
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.project.all = data;
					$scope.project.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.init()
	}])
adminModule
	.controller('teamLeaderContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'User Accounts';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'settings';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			$scope.init(true);
			// clear user
			// $scope.setting.all = [];
			// $scope.setting.page = 2;
			// User.teamLeader()
			// 	.success(function(data){
			// 		$scope.setting.all = data;
			// 		$scope.setting.all.show = true;
			// 		Preloader.stop();
			// 	})
			// 	.error(function(){
			// 		Preloader.stop();
			// 	});
		};

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
			$scope.toolbar.searchText = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.setting.all.show = false;
			Preloader.preload()
			User.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'showMembersDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-members.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true
		    })
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Team Leader';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    	controller: 'addTeamLeaderDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-team-leader.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

		$scope.init = function(refresh){
			/**
			 * Object for setting
			 *
			*/
			$scope.setting = {};
			User.teamLeader()
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.first_name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.setting.all = data;
					$scope.setting.all.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				});
		}

		$scope.init();
	}]);
adminModule
	.controller('workHoursContentContainerController', ['$scope', '$mdDialog', 'Programme', 'Preloader', function($scope, $mdDialog, Programme, Preloader){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Work Hours';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'work-hours';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			$scope.init(true);
		};

		/**
		 * Object for setting
		 *
		*/

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
		
		
		$scope.searchUserInput = function(){
			$scope.setting.all.show = false;
			Preloader.preload()
			Programme.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};
/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Work Hours';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
		    	controller: 'addWorkHoursDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

		$scope.edit = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'editWorkHoursDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		}

		$scope.delete = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Work Hour Scheme')
		        .content('Are you sure you want to delete this work hour scheme?')
		       	.ariaLabel('Delete Work Hour Scheme')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		    	Programme.delete(id)
		    		.success(function(){
		    			$scope.subheader.refresh();
		    		})
		    		.error(function(){
		    			Preloader.error();
		    		})
		    }, function() {
		    	return;
		    });
		}

		$scope.init = function(refresh){		
			$scope.setting = {};
			Programme.index()
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.label.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.setting.all = data;
					$scope.setting.all.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				});
		}

		$scope.init();
	}]);
adminModule
	.controller('addDepartmentDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		$scope.department = {};
		var busy = false;

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Department.checkDuplicate($scope.department)
				.success(function(data){
					$scope.duplicate = data;
				});
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addDepartmentForm.$invalid){
				angular.forEach($scope.addDepartmentForm.$error, function(field){
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
					busy = true;
					Department.store($scope.department)
						.success(function(data){
							if(data){
								busy = false;
								$scope.duplicate = data;
							}
							else{
								// Stops Preloader 
								Preloader.stop();
								busy = false;
							}
						}, function(){
							Preloader.error();
						});
				}
			}
		}
	}]);
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
					busy = true;
					Position.store($scope.position)
						.success(function(data){
							if(typeof(data) === "boolean")
							{
								busy = false;
								$scope.duplicate = data;
							}
							else{
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
adminModule
	.controller('addProjectDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Department', 'Project', function($scope, $stateParams, $mdDialog, Preloader, Department, Project){
		var departmentID = $stateParams.departmentID;
		var busy = false;

		$scope.project = {};
		$scope.project.department_id = departmentID;

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});


		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Project.checkDuplicate($scope.project)
				.success(function(data){
					$scope.duplicate = data;
				});
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addProjectForm.$invalid){
				angular.forEach($scope.addProjectForm.$error, function(field){
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
				if(!busy){
					busy = true;
					Project.store($scope.project)
						.success(function(data){
							if(data){
								busy = false;
								$scope.duplicate = data;
							}
							else{
								Preloader.stop();
								busy = false;
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
adminModule
	.controller('addTargetDialogController', ['$scope', '$mdDialog', 'Preloader', 'Target', function($scope, $mdDialog, Preloader, Target){
		$scope.target = {};
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addTargetForm.$invalid){
				angular.forEach($scope.addTargetForm.$error, function(field){
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
					Target.store($scope.target)
						.then(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);
adminModule
	.controller('addTeamLeaderDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'User', function($scope, $mdDialog, Preloader, Department, User){
		$scope.user = {};
		$scope.user.role = 'team-leader';
		var busy = false;
		Department.index()
			.success(function(data){
				$scope.departments = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.checkEmail = function(){
			$scope.duplicate = false;
			User.checkEmail($scope.user)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Preloader.error();
				})
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.addTeamLeaderForm.$invalid){
				angular.forEach($scope.addTeamLeaderForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.user.password != $scope.user.password_confirmation || $scope.duplicate)
			{
				return;
			}
			else{
				/* Starts Preloader */
				// Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy && !$scope.duplicate){
					busy = true;
					User.store($scope.user)
						.success(function(data){
							if(!data){
								Preloader.stop();
								busy = false;
							}
						})
						.error(function(){
							busy = false;
							Preloader.error();
						});
				}
			}
		}
	}]);
adminModule
	.controller('addWorkHoursDialogController', ['$scope', '$mdDialog', 'Preloader', 'Programme', function($scope, $mdDialog, Preloader, Programme){
		$scope.programme = {};
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addProgrammeForm.$invalid){
				angular.forEach($scope.addProgrammeForm.$error, function(field){
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
					Programme.store($scope.programme)
						.success(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
						});
				}
			}
		}
	}]);
adminModule
	.controller('approvalsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var approvalID = Preloader.get();
		var count = 0;

		Approval.details(approvalID)
			.success(function(data){
				$scope.details = data;
				$scope.show = true;
			});
			
		$scope.markAll = function(){
			if($scope.checkAll)
			{
				$scope.checkAll = true;
			}
			else{
				$scope.checkAll = false;
			}
			angular.forEach($scope.details.request, function(item, key){
				item.include = !$scope.checkAll;
			});
		}
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}


		$scope.approve = function(){
			Preloader.preload();
			if($scope.details.action == 'update'){
				Approval.approve($scope.details.request)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
			else{
				Approval.approveDelete($scope.details)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();	
					})
			}
		}

		$scope.decline = function(){
			Preloader.preload();
			if($scope.details.action == 'update'){
				Approval.decline($scope.details.request)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
			else{
				Approval.declineDelete($scope.details)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();	
					})
			}
		}
	}]);
adminModule
	.controller('approvedApprovalsDetailsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var performanceApprovalID = Preloader.get();

		PerformanceApproval.approvedDetails(performanceApprovalID)
			.success(function(data){
				$scope.details = data;
			});
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
adminModule
	.controller('declinedApprovalsDetailsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var performanceApprovalID = Preloader.get();

		PerformanceApproval.declinedDetails(performanceApprovalID)
			.success(function(data){
				$scope.details = data;
			});
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
adminModule
	.controller('downloadReportDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', 'Programme', function($scope, $mdDialog, $filter, Preloader, Report, Performance, Programme){
		$scope.details = {};
		$scope.details.type = 'Weekly';

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
				$scope.getMondays();
			})

		// $scope.hours = [7.5, 8.3, 9.1];

		$scope.months = [
			{'value': '01', 'month': 'January'},
			{'value': '02', 'month': 'February'},
			{'value': '03', 'month': 'March'},
			{'value': '04', 'month': 'April'},
			{'value': '05', 'month': 'May'},
			{'value': '06', 'month': 'June'},
			{'value': '07', 'month': 'July'},
			{'value': '08', 'month': 'August'},
			{'value': '09', 'month': 'September'},
			{'value': '10', 'month': 'October'},
			{'value': '11', 'month': 'November'},
			{'value': '12', 'month': 'December'},
		];

		$scope.months_array = [
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

		$scope.details.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.details.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.details.date_end = null;
			$scope.details.date_start = null;
			$scope.details.weekend = [];
			Performance.getMondays($scope.details)
				.success(function(data){
					$scope.mondays = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getWeekends = function(){	
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

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.submit = function(){
			if($scope.downloadReportForm.$invalid){
				$scope.showErrors = true;
				angular.forEach($scope.downloadReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				if($scope.details.type=='Weekly')
				{
					var win = window.open('/report-download-summary/' + $filter('date')($scope.details.date_start, 'yyyy-MM-dd') + '/to/' + $filter('date')($scope.details.date_end, 'yyyy-MM-dd') + '/daily-work-hours/' + $scope.details.daily_work_hours , '_blank');
					win.focus();
				}
				else if($scope.details.type=='Monthly'){
					var win = window.open('/report-download-monthly-summary/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours, '_blank');
					win.focus();	
				}
				else if($scope.details.type=='Team Performance'){
					var win = window.open('/report-team-performance/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours, '_blank');
					win.focus();	
				}

				$mdDialog.hide();
			}
		}
	}]);
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
adminModule
	.controller('editWorkHoursDialogController', ['$scope', '$mdDialog', 'Preloader', 'Programme', function($scope, $mdDialog, Preloader, Programme){
		var programmeID = Preloader.get();
		
		Programme.show(programmeID)
			.success(function(data){
				$scope.programme = data;
			})
			.error(function(){
				Preloader.error();
			});

		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addProgrammeForm.$invalid){
				angular.forEach($scope.addProgrammeForm.$error, function(field){
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
					Programme.update(programmeID, $scope.programme)
						.success(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
						});
				}
			}
		}
	}]);
adminModule
	.controller('performanceMonthlyViewDialogController', ['$scope', '$mdDialog', 'Performance', 'Preloader', function($scope, $mdDialog, Performance, Preloader){		
		$scope.member = Preloader.get();

		Performance.monthly($scope.member)
			.success(function(data){
				$scope.member = data;

				angular.forEach(data.positions, function(position){
					angular.forEach(position.performances, function(performance){
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					})
				});

				$scope.positions = data.positions;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
adminModule
	.controller('showMembersDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'Member', function($scope, $mdDialog, Preloader, User, Member){
		var teamLeaderID = Preloader.get();
		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Member.teamLeader(teamLeaderID)
			.success(function(data){
				$scope.members = data;
			});

		User.show(teamLeaderID)
			.success(function(data){
				$scope.user = data;
			});
	}]);
adminModule
	.controller('showPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Project', 'Position', function($scope, $mdDialog, Preloader, Project, Position){
		var projectID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};
		
		$scope.add = function(){
			$mdDialog.hide();
		};

		$scope.showTargets = function(id){
			$mdDialog.hide(id);	
		};

		Position.project(projectID)
			.success(function(data){
				$scope.positions = data;
			});

		Project.show(projectID)
			.success(function(data){
				$scope.project = data;
			});

	}]);
adminModule
	.controller('showProjectsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Project', function($scope, $mdDialog, Preloader, Department, Project){
		var departmentID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};
		
		$scope.add = function(){
			$mdDialog.hide();
		};

		$scope.showPositions = function(id){
			$mdDialog.hide(id);	
		};

		Project.department(departmentID)
			.success(function(data){
				$scope.projects = data;
			});

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

	}]);
adminModule
	.controller('showTargetsDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Target', 'Position', function($scope, $stateParams, $mdDialog, Preloader, Target, Position){
		var positionID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		Position.show(positionID)
			.success(function(data){
				$scope.position = data;
			});

		Target.position(positionID)
			.success(function(data){
				$scope.targets = data;
			});
	}]);
adminModule
	.controller('notificationToastController', ['$scope', '$state', 'Preloader', function($scope, $state, Preloader){
		$scope.notification = Preloader.getNotification();

		$scope.viewNotification = function(){
			$state.go($scope.notification.state, {'departmentID': $scope.notification.department_id});
		};
	}]);
//# sourceMappingURL=admin.js.map
