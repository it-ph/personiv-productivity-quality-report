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
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Approvals';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'approvals';
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.pending.show = false;
			$scope.approved.show = false;
			$scope.declined.show = false;
			$scope.pending.page = 2;
			$scope.approved.page = 2;
			$scope.declined.page = 2;

			Approval.pending()
				.success(function(data){
					$scope.pending.details = data;
					$scope.pending.paginated = data.data;
					
				
				PerformanceApproval.approved()
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						

						PerformanceApproval.declined()
							.success(function(data){
								$scope.declined.details = data;
								$scope.declined.paginated = data.data;

								$scope.pending.show = true;
								$scope.declined.show = true;
								$scope.approved.show = true;

								Preloader.stop();
							})
					})
				})

		}

		$scope.pending = {};
		$scope.approved = {};
		$scope.declined = {};

		$scope.pending.page = 2;
		$scope.approved.page = 2;
		$scope.declined.page = 2;


		/* Pending */
		Approval.pending()
			.success(function(data){
				$scope.pending.details = data;
				$scope.pending.paginated = data.data;
				$scope.pending.show = true;
				$scope.pending.busy = false;
				$scope.pending.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.pending.busy || ($scope.pending.page > $scope.pending.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.pending.busy = true;

					// Calls the next page of pagination.
					Approval.pending($scope.pending.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.pending.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.pending.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.pending.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		/* Approved */
		PerformanceApproval.approved()
			.success(function(data){
				$scope.approved.details = data;
				$scope.approved.paginated = data.data;
				$scope.approved.show = true;
				$scope.approved.busy = false;
				$scope.approved.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.approved.busy || ($scope.approved.page > $scope.approved.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.approved.busy = true;

					// Calls the next page of pagination.
					PerformanceApproval.approved($scope.approved.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.approved.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.approved.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.approved.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		/* Declined */
		PerformanceApproval.declined()
			.success(function(data){
				$scope.declined.details = data;
				$scope.declined.paginated = data.data;
				$scope.declined.show = true;
				$scope.declined.busy = false;
				$scope.declined.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.declined.busy || ($scope.declined.page > $scope.declined.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.declined.busy = true;

					// Calls the next page of pagination.
					PerformanceApproval.declined($scope.declined.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.declined.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.declined.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.declined.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		$scope.showPending = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvalsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approval.dialog.template.html',
		      parent: angular.element(document.body),
		    })
		    .then(function(){
		    	// $scope.subheader.refresh();
		    	$state.go($state.current, {}, {reload:true});
		    });
		}

		$scope.showApprovedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    });
		}

		$scope.showDeclinedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'declinedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
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


	}]);
adminModule
	.controller('departmentContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Department', 'Report', 'Performance', 'Target', 'User', function($scope, $state, $stateParams, $mdDialog, Preloader, Department, Report, Performance, Target, User){
		var departmentID = $stateParams.departmentID;
		/**
		 * Object for charts
		 *
		*/
		$scope.charts = {};
		$scope.charts.result = {};
		$scope.charts.data = [];
		$scope.charts.result.data = [];
		$scope.charts.series = [];
		$scope.charts.result.series = [];
		$scope.charts.labels = ['Productivity', 'Quality'];
		/**
		 * Object for report
		 *
		*/
		$scope.report = {};
		$scope.report.paginated = [];
		$scope.report.targets = [];
		$scope.report.topPerformers = [];
		// 2 is default so the next page to be loaded will be page 2 
		$scope.report.page = 2;

		// fetch the details of the pagination 
		Report.paginateDepartmentDetails(departmentID)
			.success(function(data){
				$scope.report.details = data;
				$scope.report.busy = true;
				angular.forEach(data.data, function(item, key){
					// fetch the targets
					Target.project(item.id)
						.success(function(data){
							$scope.report.targets.splice(key, 0, data)
						});
					Performance.topPerformers(item.id)
						.success(function(data){
							$scope.report.topPerformers.splice(key, 0, data)
						});
				});
				// fetch the custom paginated data
				Report.paginateDepartment(departmentID)
					.success(function(data){
						$scope.report.paginated = data;
						$scope.report.show = true;
						$scope.report.busy = false;
						// set up the charts
						// reports cycle
						angular.forEach($scope.report.paginated, function(parentItem, parentKey){
							// performance cycle 
							$scope.charts.data.push([]);
							$scope.charts.series.push([]);
							angular.forEach(parentItem, function(item, key){
								// push every productivity and quality of per employee
								$scope.charts.data[parentKey].push([item.productivity, item.quality]);
								$scope.charts.series[parentKey].push(item.full_name);
							});
						});
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
									// iterate over each data then splice it to the data array
									angular.forEach(data.data, function(item, key){
										$scope.report.details.data.push(item);
										// fetch the targets
										Target.project(item.id)
											.success(function(data){
												$scope.report.targets.splice(key, 0, data)
											});
										Performance.topPerformers(item.id)
											.success(function(data){
												$scope.report.topPerformers.splice(key, 0, data)
											});
									});
								});
							// Calls the next page of pagination.
							Report.paginateDepartment(departmentID, $scope.report.page)
								.success(function(data){
									// increment the page to set up next page for next AJAX Call
									$scope.report.page++;

									// iterate over each data then splice it to the data array
									angular.forEach(data, function(item, key){
										$scope.report.paginated.push(item);
									});
									// set up the charts
									// reports cycle
									angular.forEach(data, function(parentItem, parentKey){
										// performance cycle 
										$scope.charts.data.push([]);
										$scope.charts.series.push([]);
										angular.forEach(parentItem, function(item, key){
											// push every productivity and quality of per employee
											$scope.charts.data[$scope.charts.data.length -1].push([item.productivity, item.quality]);
											$scope.charts.series[$scope.charts.series.length -1].push(item.full_name);
										});
									});
									// Enables again the pagination call for next call.
									$scope.report.busy = false;
								});
						}
					})
					.error(function(){
						Preloader.error();
					});
			})
			.error(function(data){
				Preloader.error();
			});
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Weekly Report';
		Department.show(departmentID)
			.success(function(data){
				$scope.toolbar.childState = data.name;
			});
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'department';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			$scope.report.show = false;
			// start preloader
			Preloader.preload();
			// clear report
			$scope.report.paginated = [];
			$scope.report.targets = [];
			$scope.report.page = 2;
			$scope.charts.data = [];
			$scope.charts.series = [];
			$scope.report.busy = true;
			Report.paginateDepartmentDetails(departmentID)
				.success(function(data){
					$scope.report.details = data;
					angular.forEach(data.data, function(item, key){
						// fetch the targets
						Target.project(item.id)
							.success(function(data){
								$scope.report.targets.splice(key, 0, data)
							});
						Performance.topPerformers(item.id)
							.success(function(data){
								$scope.report.topPerformers.splice(key, 0, data)
							});
					});
					// fetch the custom paginated data
					Report.paginateDepartment(departmentID)
						.success(function(data){
							$scope.report.paginated = data;
							$scope.report.show = true;
							// set up the charts
							// reports cycle
							angular.forEach($scope.report.paginated, function(parentItem, parentKey){
								// performance cycle 
								$scope.charts.data.push([]);
								$scope.charts.series.push([]);
								angular.forEach(parentItem, function(item, key){
									// push every productivity and quality of per employee
									$scope.charts.data[parentKey].push([item.productivity, item.quality]);
									$scope.charts.series[parentKey].push(item.full_name);
								});
							})
							$scope.report.busy = false;
							Preloader.stop();
						})
						.error(function(){
							Preloader.error();
						});
				})
				.error(function(){
					Preloader.error();
				});
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
			$scope.toolbar.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
			$scope.report.targets = [];
			$scope.report.topPerformers = [];
			$scope.charts.result.data = [];
			$scope.charts.result.series = [];
			Preloader.preload();
			Report.searchDepartment(departmentID, $scope.toolbar)
				.success(function(data){
					$scope.report.results = data;
					angular.forEach(data, function(item, key){
						Target.project(item[0].id)
							.success(function(data){
								$scope.report.targets.splice(key, 0, data)
							});
						Performance.topPerformers(item[0].report_id)
							.success(function(data){
								$scope.report.topPerformers.splice(key, 0, data)
							});
					});
					angular.forEach($scope.report.results, function(parentItem, parentKey){
						// performance cycle 
						$scope.charts.result.data.push([]);
						$scope.charts.result.series.push([]);
						angular.forEach(parentItem, function(item, key){
							// push every productivity and quality of per employee
							$scope.charts.result.data[parentKey].push([item.productivity, item.quality]);
							$scope.charts.result.series[parentKey].push(item.full_name);
						});
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

		// $scope.rightSidenav = {};

		// $scope.rightSidenav.show = true;

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
			$scope.setting.all = {};
			$scope.setting.page = 2;
			Department.index()
				.success(function(data){
					$scope.setting.all = data;
					$scope.setting.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for setting
		 *
		*/
		$scope.setting = {};
		Department.index()
			.success(function(data){
				$scope.setting.all = data;
				$scope.setting.all.show = true;
			});

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
	}]);
adminModule
	.controller('editReportContentContainerController', ['$scope', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', function($scope, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project){
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
				$scope.details.project_id = data[0].project_id;
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
				'name':'Team Leaders',
				'state':'main.team-leaders',
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
	.controller('mainContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Report', 'User', 'Target', function($scope, $state, $stateParams, $mdDialog, Preloader, Report, User, Target){
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
		var dateCreated = 2015;

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.hours = [7.5, 8.3, 9.1];

		$scope.currentMonth = $scope.months[new Date().getMonth()];

		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Dashboard';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'dashboard';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.report = {};
			$scope.reports = [];
			$scope.charts = [];
			$scope.chart = {};
			$scope.chart.series = ['Productivity', 'Quality'];

			Report.monthly()
				.success(function(data){
					$scope.reports = data;
					
					angular.forEach(data, function(report, reportIdx){
						$scope.charts.push([{}]);
						$scope.charts[reportIdx].data = [];
						$scope.charts[reportIdx].data.push([]); // index 0 is productivity
						$scope.charts[reportIdx].data.push([]); // index 1 is quality
						$scope.charts[reportIdx].labels = [];
						$scope.charts[reportIdx].positions = [];
						if(report.length){
							angular.forEach(report[0].positions, function(position, keyPostion){
								$scope.charts[reportIdx].positions.push(position.name);
							});
							$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
						}

						angular.forEach(report, function(member, memberIdx){
							$scope.charts[reportIdx].labels.push(member.full_name);

							$scope.charts[reportIdx].data[0].push(member.productivity_average);
							$scope.charts[reportIdx].data[1].push(member.quality_average);
						});
					});

					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				})
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

		$scope.charts = [];
		$scope.chart = {};
		$scope.chart.series = ['Productivity', 'Quality'];

		Report.monthly()
			.success(function(data){
				$scope.reports = data;
				angular.forEach(data, function(report, reportIdx){
					$scope.charts.push([{}]);
					$scope.charts[reportIdx].data = [];
					$scope.charts[reportIdx].data.push([]); // index 0 is productivity
					$scope.charts[reportIdx].data.push([]); // index 1 is quality
					$scope.charts[reportIdx].labels = [];
					$scope.charts[reportIdx].positions = [];
					if(report.length){
						angular.forEach(report[0].positions, function(position, keyPostion){
							$scope.charts[reportIdx].positions.push(position.name);
						});
						$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
					}

					angular.forEach(report, function(member, memberIdx){
						$scope.charts[reportIdx].labels.push(member.full_name);

						$scope.charts[reportIdx].data[0].push(member.productivity_average);
						$scope.charts[reportIdx].data[1].push(member.quality_average);
					});
				});
			})
			.error(function(){
				Preloader.error();
			})

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
						$scope.reports = data;
						angular.forEach(data, function(report, reportIdx){
							$scope.charts.push([{}]);
							$scope.charts[reportIdx].data = [];
							$scope.charts[reportIdx].data.push([]); // index 0 is productivity
							$scope.charts[reportIdx].data.push([]); // index 1 is quality
							$scope.charts[reportIdx].labels = [];
							$scope.charts[reportIdx].positions = [];
							if(report.length){
								angular.forEach(report[0].positions, function(position, keyPostion){
									$scope.charts[reportIdx].positions.push(position.name);
								});
								$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
							}

							angular.forEach(report, function(member, memberIdx){
								$scope.charts[reportIdx].labels.push(member.full_name);

								$scope.charts[reportIdx].data[0].push(member.productivity_average);
								$scope.charts[reportIdx].data[1].push(member.quality_average);
							});
						});
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					})
			}
		}

		$scope.test = function(data){
			Preloader.set(data);

			$mdDialog.show({
		    	controller: 'performanceMonthlyViewDialogController',
		    	templateUrl: '/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html',
		    	parent: angular.element(document.body),
		      	clickOutsideToClose:true
		    });
		}
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
			$scope.position = {};
			$scope.position.show = false;		
			Position.project(project_id)
				.success(function(data){
					Preloader.stop();
					$scope.position.all = data;
					$scope.position.show = true;
				})
				.error(function(){
					Preloader.error();
				});
		}

		Position.project(project_id)
			.success(function(data){
				$scope.position.all = data;
				$scope.position.show = true;
			})
			.error(function(){
				Preloader.error();
			});

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
			$scope.toolbar.userInput = '';
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
		      	templateUrl: '/app/components/admin/templates/dialogs/edit-position.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    });
		}
	}])
adminModule
	.controller('projectsContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Department', 'Preloader', 'Project', function($scope, $state, $stateParams, $mdDialog, Department, Preloader, Project){
		/**
		 * Object for toolbar
		 *
		*/
		var department_id = $stateParams.departmentID;
		$scope.project = {};

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
			$scope.project = {};
			$scope.project.show = false;		
			Project.department(department_id)
				.success(function(data){
					$scope.project.all = data;
					$scope.project.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}

		Project.department(department_id)
			.success(function(data){
				$scope.project.all = data;
				$scope.project.show = true;
			})
			.error(function(){
				Preloader.error();
			});
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
			$scope.toolbar.userInput = '';
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
	}])
adminModule
	.controller('teamLeaderContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Team Leaders';
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
			// clear user
			$scope.setting.all = [];
			$scope.setting.page = 2;
			User.teamLeader()
				.success(function(data){
					$scope.setting.all = data;
					$scope.setting.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for setting
		 *
		*/
		$scope.setting = {};
		User.teamLeader()
			.success(function(data){
				$scope.setting.all = data;
				$scope.setting.all.show = true;
			});

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
	}]);
adminModule
	.controller('addDepartmentDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		$scope.department = {};
		var busy = false;

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
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy){
					busy = true;
					Department.store($scope.department)
						.then(function(){
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
	.controller('addPositionDialogController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Project', 'Position', 'Target', function($scope, $stateParams, $mdDialog, Preloader, Project, Position, Target){
		var departmentID = $stateParams.departmentID;
		var projectID = $stateParams.projectID;
		var busy = false;

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
				'type': 'Productivity',
				'experience': 'Beginner',
			},
			{
				'type': 'Productivity',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'Productivity',
				'experience': 'Experienced',
			},
		];

		$scope.quality = [
			{
				'type': 'Quality',
				'experience': 'Beginner',
			},
			{
				'type': 'Quality',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'Quality',
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
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy){
					busy = true;
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
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy){
					busy = true;
					Project.store($scope.project)
						.success(function(){
							Preloader.stop();
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
		var busy = false;
		Department.index()
			.success(function(data){
				$scope.departments = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addTeamLeaderForm.$invalid){
				angular.forEach($scope.addTeamLeaderForm.$error, function(field){
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
					User.store($scope.user)
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
	.controller('downloadReportDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', function($scope, $mdDialog, $filter, Preloader, Report, Performance){
		$scope.details = {};
		$scope.details.type = 'Weekly';

		$scope.hours = [7.5, 8.3, 9.1];

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
adminModule
	.controller('performanceMonthlyViewDialogController', ['$scope', '$mdDialog', 'Performance', 'Preloader', function($scope, $mdDialog, Performance, Preloader){
		$scope.member = Preloader.get();

		Performance.monthly($scope.member)
			.success(function(data){
				$scope.performances = data;
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
