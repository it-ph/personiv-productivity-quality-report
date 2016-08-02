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
						controller: 'mainMonthlyContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/components/team-leader/templates/content/main-monthly.content.template.html',
					},
					'right-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-monthly-right.sidenav.html',
					}
				}
			})
			.state('main.weekly-report',{
				url:'weekly-report',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'toolbar@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.weekly-report': {
						templateUrl: '/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				},
			})
			.state('main.members', {
				url:'members',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
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
			.state('main.create-member', {
				url:'member/create',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'createMemberContentContainerController',
					},
					'toolbar@main.create-member': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.create-member':{
						templateUrl: '/app/components/team-leader/templates/content/create-member-content.template.html',
					},
				}
			})
			.state('main.edit-member', {
				url:'member/{memberID}/edit',
				params: {memberID:null},
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'editMemberContentContainerController',
					},
					'toolbar@main.edit-member': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.edit-member':{
						templateUrl: '/app/components/team-leader/templates/content/create-member-content.template.html',
					},
				}
			})
			.state('main.report', {
				url:'report',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'reportContentContainerController',
					},
					'toolbar@main.report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.report':{
						templateUrl: '/app/components/team-leader/templates/content/report.content.template.html',
					},
					'right-sidenav@main.report':{
						templateUrl: '/app/components/team-leader/templates/sidenavs/report-right.sidenav.html',
					}
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.edit-report',{
				url:'edit-report/{reportID}',
				params: {'reportID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'editReportContentContainerController',
					},
					'toolbar@main.edit-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.edit-report':{
						templateUrl: '/app/shared/templates/content/edit-report.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.approvals',{
				url:'approvals',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/app/shared/templates/content/approval.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})

	}]);
teamLeaderModule
	.controller('approvalsContentContainerController', ['$scope', '$mdDialog', 'PerformanceApproval', 'Approval', 'Preloader', 'User',  function($scope, $mdDialog, PerformanceApproval, Approval, Preloader, User){
		User.index()
			.success(function(data){
				$user = data;

				$scope.pending = {};
				$scope.approved = {};
				$scope.declined = {};

				$scope.pending.page = 2;
				$scope.approved.page = 2;
				$scope.declined.page = 2;


				/* Pending */
				Approval.pendingUser($user.id)
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
							Approval.pendingUser($user.id, $scope.pending.page)
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
				PerformanceApproval.approvedUser($user.id)
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
							PerformanceApproval.approvedUser($user.id, $scope.approved.page)
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
				PerformanceApproval.declinedUser($user.id)
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
							PerformanceApproval.declinedUser($user.id, $scope.declined.page)
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
			});
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

			Approval.pendingUser($user.id)
				.success(function(data){
					$scope.pending.details = data;
					$scope.pending.paginated = data.data;
					
				
				PerformanceApproval.approvedUser($user.id)
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						

						PerformanceApproval.declinedUser($user.id)
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

		$scope.showPending = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvalsDialogController',
		      templateUrl: '/app/components/team-leader/templates/dialogs/approval.dialog.template.html',
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
teamLeaderModule
	.controller('createMemberContentContainerController', ['$scope', '$state', 'Project', 'Member', 'Experience', 'Preloader', function($scope, $state, Project, Member, Experience, Preloader){
		$scope.form = {};
		$scope.member = {};
		$scope.member_projects = [];
		$scope.maxDate = new Date();

		Project.index()
			.success(function(data){
				$scope.projects = data;
				angular.forEach(data, function(item, key){
					$scope.member_projects.push({});
				});
			})
			.error(function(){
				Preloader.error();
			})

		var busy = false;
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Members';
		$scope.toolbar.childState = 'Create';
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.members');
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
			$scope.submit();
		}

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Member.checkDuplicate($scope.member)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.submit = function(){
			if($scope.form.memberForm.$invalid){
				angular.forEach($scope.form.memberForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				//  * Stores Single Record
				// Preloader.saving();

				// console.log($scope.member_projects);
				if(!busy){
					busy = true;

					Member.store($scope.member)
						.then(function(data){
							if(typeof(data.data) === "boolean"){
								busy = false;
								return;
							}
							else{
								return data.data;
							}
						})
						.then(function(memberID){
							if(memberID){
								angular.forEach($scope.member_projects, function(item){
									item.member_id = memberID;
									item.date_started = item.date_started.toDateString();
								});

								Experience.store($scope.member_projects)
									.success(function(){
										$state.go('main.members');
										return;
									})
									.error(function(){
										busy = false;
										Preloader.error();
									});
							}

							return
						}, function(){
							busy = false;
							Preloader.error();
						});
				}
			}
		}

	}]);
teamLeaderModule
	.controller('editMemberContentContainerController', ['$scope', '$state', '$stateParams', 'Project', 'Member', 'Experience', 'Preloader', function($scope, $state, $stateParams, Project, Member, Experience, Preloader){
		var memberID = $stateParams.memberID;
		$scope.form = {};
		$scope.member = {};
		$scope.member_projects = [];
		$scope.maxDate = new Date();

		var busy = false;
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Edit';
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.members');
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
			$scope.submit();
		}

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Member.checkDuplicate($scope.member)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.submit = function(){
			if($scope.form.memberForm.$invalid){
				angular.forEach($scope.form.memberForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				//  * Stores Single Record
				// Preloader.saving();

				// console.log($scope.member_projects);
				if(!busy){
					busy = true;

					Member.update(memberID, $scope.member)
						.then(function(data){
							if(typeof(data.data) === "boolean"){
								busy = false;
								return;
							}
							else{
								return data.data;
							}
						})
						.then(function(memberID){
							if(memberID){
								angular.forEach($scope.member_projects, function(item){
									item.member_id = memberID;
									item.date_started = item.date_started.toDateString();
								});

								Experience.store($scope.member_projects)
									.success(function(){
										$state.go('main.members');
										return;
									})
									.error(function(){
										busy = false;
										Preloader.error();
									});
							}

							return
						}, function(){
							busy = false;
							Preloader.error();
						});
				}
			}
		}

		$scope.init = function(){
			Project.index()
				.then(function(data){
					$scope.projects = data.data;
				})
				.then(function(){
					Member.show(memberID)
						.success(function(data){
							angular.forEach(data.experiences, function(item){
								item.date_started = new Date(item.date_started);
							});
							$scope.toolbar.childState = data.full_name;

							$scope.member = data;
							$scope.member_projects = data.experiences;
						})
				})
		}();

	}]);
teamLeaderModule
	.controller('editReportContentContainerController', ['$scope', '$filter', '$mdDialog', '$state', '$mdToast', '$stateParams', 'Preloader', 'Performance', 'Position', 'Project', 'Approval', function($scope, $filter, $mdDialog, $state, $mdToast, $stateParams, Preloader, Performance, Position, Project, Approval){
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
teamLeaderModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'User', function($scope, $mdSidenav, User){
		$scope.menu = {};
		User.index()
			.success(function(data){
				var user = data;
				
				if(user.role=='team-leader')
				{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s monthly performance.',
						},
						{
							'name':'Weekly Report',
							'state':'main.weekly-report',
							'icon':'mdi-view-carousel',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Approvals',
							'state':'main.approvals',
							'icon':'mdi-file-document-box',
							'tip': 'Approvals: shows pending request for report changes.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
						{
							'name':'Report',
							'state': 'main.report',
							'icon':'mdi-file-document',
							'tip': 'Report: submit team\'s weekly reports',
						},
					];
				}
				else if(user.role=='manager')
				{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s monthly performance.',
						},
						{
							'name':'Weekly Report',
							'state':'main.weekly-report',
							'icon':'mdi-view-carousel',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
					];
				}
				else{
					$scope.menu.section = [
						{
							'name':'Dashboard',
							'state':'main',
							'icon':'mdi-view-dashboard',
							'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
						},
						{
							'name':'Approvals',
							'state':'main.approvals',
							'icon':'mdi-file-document-box',
							'tip': 'Approvals: shows pending request for report changes.',
						},
						{
							'name':'Members',
							'state': 'main.members',
							'icon':'mdi-account-multiple',
							'tip': 'Members: manage people in your team.',
						},
					];
				}
			});

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);
teamLeaderModule
	.controller('mainContentContainerController', ['$scope', '$filter', '$state', '$mdToast', '$mdDialog', 'Approval', 'Preloader', 'Member', 'Position', 'Report', 'Performance', 'Target', 'User', 'WalkThrough', 'Project', function($scope, $filter, $state, $mdToast, $mdDialog, Approval, Preloader, Member, Position, Report, Performance, Target, User, WalkThrough, Project){
		var user = null;
		$scope.tour = {};
		$scope.tour.search = 'Need to find something? I\'ll help you find what you\'re looking for.';
		$scope.tour.notification = 'You don\'t have to wait for the confirmation of your request. I\'ll notify you when something needs your attention.';
		$scope.tour.refresh = 'Refreshes the current displayed data.'
		$scope.subheaderTour = function(){
			$scope.subheaderTour = 0;
		}
		$scope.stopTours = function(){
			WalkThrough.show(user.id)
				.success(function(data){
					if(!data){			
						WalkThrough.store(user)
							.error(function(){
								Preloader.error();
							});
					}
				})
		}

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

		$scope.getPositions = function(){
			Position.project($scope.projects[$scope.filterData.project].id)
				.success(function(data){
					$scope.positions = data;
				})
		}

		$scope.clearFilter = function(){
			$scope.positions = [];
			$scope.filterData.project = '';
			$scope.filterData.position = '';
			$scope.filterDate.date_start = '';
			$scope.filterDate.date_end = ''
		}
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Weekly Report';
		$scope.toolbar.hideSearchIcon = true;
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
			$scope.init(true);

		};

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
		}
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
			Preloader.preload();
			Report.search($scope.filterDate)
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

		$scope.editReport = function(id){
			$state.go('main.edit-report', {'reportID':id});
		};

		$scope.deleteReport = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Report')
		        .content('Are you sure you want to delete this report?')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm)
		    	.then(function() {
		    		Preloader.preload();
			    	Approval.reportDelete(id)
			    		.success(function(){
			    			Preloader.stop();
			    			$mdToast.show(
						    	$mdToast.simple()
							        .content('Request has been submitted for approval.')
							        .position('bottom right')
							        .hideDelay(3000)
						    );
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
			Member.index()
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

			Position.index()
				.success(function(data){
					$scope.positions = data;
				});

			Project.index()
				.success(function(data){
					$scope.projects = data;
				});

			$scope.getMondays();
			/**
			 * Object for report
			 *
			*/
			$scope.report = {};
			$scope.report.paginated = [];
			// 2 is default so the next page to be loaded will be page 2 
			$scope.report.page = 2;

			Report.paginateDetails()
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

						Report.paginateDetails($scope.report.page)
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
teamLeaderModule
	.controller('mainMonthlyContentContainerController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'Report', 'Programme', 'Member', function($scope, $filter, $mdDialog, Preloader, Report, Programme, Member){
		$scope.report = {};
		$scope.form = {};

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

		/**
		 * Object for right sidenav
		 *
		*/
		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;
		$scope.rightSidenav.month = $scope.months_array[new Date().getMonth()];
		$scope.rightSidenav.year = new Date().getFullYear();
		$scope.rightSidenav.items = [];
		$scope.rightSidenav.queryMember = function(query){
			var results = query ? $filter('filter')($scope.rightSidenav.items, query) : $scope.rightSidenav.items;
			return results;
		}

		Member.index()
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

		Programme.index()
			.success(function(data){
				$scope.hours = data;
			})

		$scope.clearFilter = function(){
			$scope.rightSidenav.searchText = '';
			$scope.rightSidenav.month = $scope.months_array[new Date().getMonth()];
			$scope.rightSidenav.year = new Date().getFullYear();
			$scope.rightSidenav.daily_work_hours = '';
		}

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
		$scope.subheader.state = 'dashboard';
		$scope.subheader.refresh = function(){
			$scope.report = {};
			Preloader.preload();
			$scope.init(true);
		}

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
		}

		$scope.searchFilter = function(){
			if($scope.form.filterSearchForm.$invalid){
				angular.forEach($scope.form.filterSearchForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				Preloader.preload();
				$scope.init(true, $scope.rightSidenav);
			}
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

		$scope.init = function(refresh, query){
			Report.departmentMonthly(query)
				.success(function(data){
					angular.forEach(data, function(project){
						project.chart = {};
						project.chart.series = ['Productivity', 'Quality'];
						project.chart.data = [[],[]];
						project.chart.labels = [];

						project.date_start = new Date(project.date_start);
						
						angular.forEach(project.members, function(member){
							if(member.average_productivity && member.average_productivity){
								project.chart.data[0].push(member.average_productivity);
								project.chart.data[1].push(member.average_quality);
								project.chart.labels.push(member.member.full_name);
							}
						});
					});

					$scope.report.current = data;
					$scope.report.showCurrent = true;

					if(query){
						$scope.haveResults = data ? true: false;
						console.log($scope.haveResults);
						console.log($scope.report.showCurrent);
						
					}
					else{
						$scope.haveCurrent = data ? true: false;
					}


					if(refresh)
					{
						Preloader.stop();
					}
				})
				.error(function(){
					Preloader.error();
				});
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
teamLeaderModule
	.controller('membersContentContainerController', ['$scope', '$state', '$mdDialog', 'Preloader', 'Member', 'User', function($scope, $state, $mdDialog, Preloader, Member, User){
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
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';

		$scope.fab.action = function(){
			$state.go('main.create-member');
			// $mdDialog.show({
	  //   		controller: 'addMemberDialogController',
		 //      	templateUrl: '/app/components/team-leader/templates/dialogs/add-member.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(){
		 //    	$scope.subheader.refresh();
		 //    })
		};
		
		/**
		 * Object for member
		 *
		*/
		// if(!$scope.user){
		// 	// console.log('new')
		// 	User.index()
		// 		.success(function(data){
		// 			$scope.toolbar.team_leader_id = data.id
		// 			$scope.user = data;
		// 			if(data.role=='team-leader')
		// 			{
		// 				Member.teamLeader(data.id)
		// 					.success(function(data){
		// 						angular.forEach(data, function(item){
		// 							item.first_letter = item.full_name.charAt(0).toUpperCase();
		// 						});

		// 						$scope.member.all = data;
		// 						$scope.member.all.show = true;
		// 						$scope.option = true;
		// 					});
		// 			}
		// 			else{
		// 				Member.department(data.department_id)
		// 					.success(function(data){
		// 						angular.forEach(data, function(item){
		// 							item.first_letter = item.full_name[0].toUpperCase();
		// 						});

		// 						$scope.member.all = data;
		// 						$scope.member.all.show = true;
		// 						$scope.option = false;
		// 					});
		// 			}
		// 			$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
		// 		});
		// }
		// else{
		// 	// console.log('old');
		// 	$scope.toolbar.team_leader_id = $scope.user.id
		// 	$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
		// 	if($scope.user.role=='team-leader')
		// 	{
		// 		Member.teamLeader($scope.user.id)
		// 			.success(function(data){
		// 				$scope.member.all = data;
		// 				$scope.member.all.show = true;
		// 				$scope.option = true;
		// 			});
		// 	}
		// 	else{
		// 		Member.department($scope.user.department_id)
		// 			.success(function(data){
		// 				$scope.member.all = data;
		// 				$scope.member.all.show = true;
		// 				$scope.option = false;
		// 			});
		// 	}
		// }

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

		$scope.editMember = function(id){
			$state.go('main.edit-member', {'memberID':id});
			// Preloader.set(id);
			// $mdDialog.show({
	  //   		controller: 'editMemberDialogController',
		 //      	templateUrl: '/app/components/team-leader/templates/dialogs/edit-member.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(){
		 //    	$scope.subheader.refresh();
		 //    })
		}

		$scope.deleteMember = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Member')
		        .content('This member will not be included to your report anymore.')
		        .ariaLabel('Delete Member')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		      Member.delete(id)
				.success(function(){
					$scope.subheader.refresh();
				});
		    }, function() {
		      return;
		    });			
		};

		$scope.init = function(refresh){
			$scope.member = {};
			User.index()
				.then(function(data){
					$scope.fab.show = data.data.role == 'team-leader' ? true : false;
					Member.department()
						.success(function(data){
							angular.forEach(data, function(member){
								member.first_letter = member.full_name.charAt(0).toUpperCase();
								angular.forEach(member.experiences, function(experience){
									experience.date_started = new Date(experience.date_started);
								});
							});

							$scope.member.all = data;
							$scope.member.all.show = true;
							$scope.option = true;

							if(refresh){
								Preloader.stop();
								Preloader.stop();
							}
						})
						.error(function(){
							Preloader.error();
						});
				}, function(){
					Preloader.error();
				})
		}

		$scope.init();
	}]);
teamLeaderModule
	.controller('notificationToastController', ['$scope', '$state', 'Preloader', function($scope, $state, Preloader){
		$scope.notification = Preloader.getNotification();

		$scope.viewNotification = function(){
			$state.go($scope.notification.state);
		};
	}]);
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

		// if(!user){
		// 	User.index()
		// 		.success(function(data){
		// 			$scope.user = data;
		// 			departmentID = data.department_id;
		// 			Member.updateTenure(data.id)
		// 				.success(function(){					
		// 					Member.teamLeader(data.id)
		// 						.success(function(data){
		// 							$scope.members = data;
		// 						});
		// 				})
		// 			Project.department(departmentID)
		// 				.success(function(data){
		// 					$scope.projects = data;
		// 				})
		// 		});
		// }
		// else{		
		// 	departmentID = user.department_id;
		// 	Member.teamLeader(user.id)
		// 		.success(function(data){
		// 			$scope.members = data;
		// 		});
		// 	Project.department(user.department_id)
		// 		.success(function(data){
		// 			$scope.projects = data;
		// 		})
		// }

		$scope.showPositions = function(projectID){
			Position.project(projectID)
				.success(function(data){
					$scope.positions = data;
				});

			Experience.members(projectID)
				.success(function(data){
					angular.forEach(data, function(item){
						item.date_started = new Date(item.date_started);
						item.first_letter = item.member.full_name.charAt(0).toUpperCase();
					});

					$scope.members = data;
					$scope.resetMembers();
				});

			Project.show(projectID)
				.success(function(data){
					$scope.project = data;
				});
		};

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
			console.log(data);
			var idx = $scope.members.indexOf(data);
			console.log(idx);
			// gets the number of days worked in a day then multiply it to the daily work hours to get weekly limit
			$scope.details.weekly_hours = ((new Date($scope.details.date_end) - new Date($scope.details.date_start)) / (1000*60*60*24) + 1) * $scope.details.daily_work_hours;
			Performance.checkLimit($scope.members[idx].member.id, $scope.details)
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
				$scope.checkLimit(item);
			});
		}

		$scope.checkBalance = function(data){
			var index = $scope.members.indexOf(data);
			$scope.members[index].balance = $scope.members[index].limit - $scope.members[index].hours_worked;
			$scope.members[index].balance = $scope.members[index].balance ? $scope.members[index].balance.toFixed(2) : 0;
		}

		// $scope.checkProgramme = function(idx){
		// 	$scope.details.programme_id = $scope.work_hours[idx].id;
		// }

		$scope.init = function(){
			Member.updateTenure()
				.then(function(){
					return;					
				})
				// .then(function(){
				// 	Member.index()
				// 		.success(function(data){
				// 			$scope.members = data;
				// 			return;
				// 		})
				// 		.error(function(){
				// 			Preloader.error();
				// 		});
				// })
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
				}, function(){
					Preloader.error();
				})
		}();
	}]);
teamLeaderModule
	.controller('addMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'User', 'Member', function($scope, $mdDialog, Preloader, User, Member){
		var user = Preloader.getUser();
		var busy = false;
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

		$scope.submit = function(){
			$scope.showErrors = true;
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
				console.log(busy);
				if(!busy){
					busy = true;
					Member.store($scope.member)
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
teamLeaderModule
	.controller('approvalsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var approvalID = Preloader.get();
		$scope.user = Preloader.getUser();

		Approval.details(approvalID)
			.success(function(data){
				$scope.details = data;
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
		$scope.cancelRequest = function(){
			Preloader.preload();
			Approval.delete(approvalID)
				.success(function(){
					// Stops Preloader 
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);
teamLeaderModule
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
teamLeaderModule
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
teamLeaderModule
	.controller('downloadReportDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', 'Programme', 'Project', 'Position', function($scope, $mdDialog, $filter, Preloader, Report, Performance, Programme, Project, Position){
		$scope.details = {};
		$scope.details.type = 'Weekly';

		var user = Preloader.getUser();

		if(!user)
		{
			User.index()
				.success(function(data){
					user = data;
				})
				.error(function(){
					Preloader.error();
				});
		}

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
					var win = window.open('/report-download-weekly-department/' + user.department_id + '/date_start/' + $filter('date')($scope.details.date_start, 'yyyy-MM-dd') + '/to/' + $filter('date')($scope.details.date_end, 'yyyy-MM-dd') + '/daily-work-hours/' + $scope.details.daily_work_hours , '_blank');
					win.focus();
				}
				else if($scope.details.type=='Monthly'){
					var win = window.open('/report-download-monthly-department/' + user.department_id + '/month/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours + '/project/' + $scope.details.project + '/position/' + $scope.details.position, '_blank');
					win.focus();	
				}

				$mdDialog.hide();
			}
		}

		$scope.init = function(){
			Project.index()
				.success(function(data){
					$scope.projects = data;
				})

			Programme.index()
				.success(function(data){
					$scope.work_hours = data;
					$scope.getMondays();
				})
				.error(function(){
					Preloader.error();
				})
		}();

		$scope.getPositions = function(){
			Project.show($scope.details.project)
				.success(function(data){
					$scope.positions = data.positions;
				})
		}

	}]);
teamLeaderModule
	.controller('editMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'Member', function($scope, $mdDialog, Preloader, Member){
		var member_id = Preloader.get();
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		Member.show(member_id)
			.success(function(data){
				$scope.member = data;
			});

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.editMemberForm.$invalid){
				angular.forEach($scope.editMemberForm.$error, function(field){
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
					Member.update(member_id, $scope.member)
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
teamLeaderModule
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
//# sourceMappingURL=team-leader.js.map
