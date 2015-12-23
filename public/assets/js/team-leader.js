var teamLeaderModule = angular.module('teamLeaderModule', [
	/* Shared Module */
	'sharedModule'
]); 
teamLeaderModule
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
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				}
			})
			.state('main.members', {
				url:'members',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'membersContentContainerController',
					},
					'toolbar@main.members': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.members':{
						templateUrl: '/app/components/team-leader/templates/content/members.content.template.html',
					},
				}
			})
			.state('main.report', {
				url:'report',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'reportContentContainerController',
					},
					'toolbar@main.report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.report':{
						templateUrl: '/app/components/team-leader/templates/content/report.content.template.html',
					},
				}
			})

	}]);
teamLeaderModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Dashboard',
				'state':'main',
				'icon':'mdi-view-dashboard',
			},
			{
				'name':'Members',
				'state': 'main.members',
				'icon':'mdi-account-multiple',
			},
			{
				'name':'Report',
				'state': 'main.report',
				'icon':'mdi-file-document',
			},
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);
teamLeaderModule
	.controller('mainContentContainerController', ['$scope', '$state', 'Preloader', 'Report', 'Target', 'User', function($scope, $state, Preloader, Report, Target, User){
		var user = null;
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
		// 2 is default so the next page to be loaded will be page 2 
		$scope.report.page = 2;

		User.index()
			.success(function(data){
				user = data;
				// fetch the targets
				Target.department(user.department_id)
					.success(function(data){
						$scope.targets = data;
					});
				// fetch the details of the pagination 
				Report.paginateDepartmentDetails(user.department_id)
					.success(function(data){
						$scope.report.details = data;
						$scope.report.busy = true;
						// fetch the custom paginated data
						Report.paginateDepartment(user.department_id)
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
								$scope.report.busy = false;
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

									// Calls the next page of pagination.
									Report.paginateDepartment(user.department_id, $scope.report.page)
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
			});
		
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
			$scope.report.show = false;
			// start preloader
			Preloader.preload();
			// clear report
			$scope.report.paginated = [];
			$scope.report.page = 2;
			$scope.charts.data = [];
			$scope.charts.series = [];
			$scope.report.busy = true;
			Report.paginateDepartmentDetails(user.department_id)
				.success(function(data){
					$scope.report.details = data;
					// fetch the custom paginated data
					Report.paginateDepartment(user.department_id)
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
			$scope.charts.result.data = [];
			$scope.charts.result.series = [];
			Preloader.preload();
			Report.searchDepartment(user.department_id, $scope.toolbar)
				.success(function(data){
					$scope.report.results = data;
					angular.forEach($scope.report.results, function(parentItem, parentKey){
						// performance cycle 
						$scope.charts.result.data.push([]);
						$scope.charts.result.series.push([]);
						angular.forEach(parentItem, function(item, key){
							// push every productivity and quality of per employee
							$scope.charts.result.data[parentKey].push([item.productivity, item.quality]);
							$scope.charts.result.series[parentKey].push(item.full_name);
						});
					})
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

		$scope.rightSidenav = {};

		$scope.rightSidenav.show = true;
	}]);
teamLeaderModule
	.controller('membersContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Member', 'User', function($scope, $mdDialog, Preloader, Member, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Members';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'members';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear member
			$scope.member.all = {};
			$scope.member.page = 2;
			Member.teamLeader($scope.toolbar.team_leader_id)
				.success(function(data){
					$scope.member.all = data;
					$scope.member.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for member
		 *
		*/
		var user = Preloader.getUser();
		$scope.member = {};
		if(!user){
			User.index()
				.success(function(data){
					$scope.toolbar.team_leader_id = data.id
					Member.teamLeader(data.id)
						.success(function(data){
							$scope.member.all = data;
							$scope.member.all.show = true;
						});
				});
		}
		else{
			$scope.toolbar.team_leader_id = user.id
			Member.teamLeader(user.id)
				.success(function(data){
					$scope.member.all = data;
					$scope.member.all.show = true;
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
			$scope.member.all.show = false;
			Preloader.preload()
			Member.search($scope.toolbar)
				.success(function(data){
					$scope.member.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			Preloader.set(id);
			// $mdDialog.show({
		 //    	controller: 'showPositionDialogController',
		 //      	templateUrl: '/app/components/admin/templates/dialogs/show-positions.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(id){
		 //    	if(!id){
			//     	$mdDialog.show({
			// 	    	controller: 'addPositionDialogController',
			// 	      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
			// 	      	parent: angular.element(document.body),
			// 	    })
			// 	    .then(function(){
			// 	    	$scope.subheader.refresh();
			// 	    })
		 //    	}
		 //    	else{
		 //    		Preloader.set(id);
		 //    		$mdDialog.show({
			// 	    	controller: 'showTargetsDialogController',
			// 	      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
			// 	      	parent: angular.element(document.body),
			// 	      	clickOutsideToClose: true,
			// 	    })
		 //    	}
		 //    });
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    		controller: 'addMemberDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/add-member.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};
	}]);
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
	}]);
teamLeaderModule
	.controller('addMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'Member', function($scope, $mdDialog, Preloader, User, Member){
		var user = Preloader.getUser();
		if(!user){
			User.index()
				.success(function(data){
					user = data;
				});
		};

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.member = {};
		$scope.member.team_leader_id = user.id;

		$scope.experiences = [
			{
				'category':'Beginner',
				'duration':'less than 3 months',
			},
			{
				'category':'Moderately Experienced',
				'duration':'3 months to 6 months',
			},
			{
				'category':'Experienced',
				'duration':'more than 6 months',
			},
		];

		$scope.submit = function(){
			if($scope.addMemberForm.$invalid){
				angular.forEach($scope.addMemberForm.$error, function(field){
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
				Member.store($scope.member)
					.then(function(){
						// Stops Preloader 
						Preloader.stop();
					}, function(){
						Preloader.error();
					});
			}
		}
	}]);
//# sourceMappingURL=team-leader.js.map
