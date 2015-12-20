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
						templateUrl: '/app/components/team-leader/templates/content/main.content.template.html',
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
	.controller('mainContentContainerController', ['$scope', '$state', 'Preloader', 'Result', 'User', function($scope, $state, Preloader, Result, User){
		var user = Preloader.getUser();
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
			// start preloader
			Preloader.preload();
			// clear result
			$scope.result.paginated = {};
			$scope.result.page = 2;
			Result.paginateDepartment(user.department_id)
				.then(function(data){
					$scope.result.paginated = data.data;
					$scope.result.show = true;
					// stop preload
					Preloader.stop();
				}, function(){
					Preloader.error();
				});
		};

		$scope.data = [
			// Productivity / Quality
			[90,100],
			[80,100],
			[90,90],
			[85,100],
			[70,100],
			[110,95],
			[120,90],
			[95,95],
			[120,90],
			[100,100],
		];

		$scope.labels = ['Productivity', 'Quality'];

		$scope.series = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
		/**
		 * Object for result
		 *
		*/
		$scope.result = {};
		$scope.result.paginated = [];
		// 2 is default so the next page to be loaded will be page 2 
		$scope.result.page = 2;
		
		// if(!user){
		// 	User.index()
		// 		.success(function(data){
		// 			user = data;

		// 			Result.paginateDepartment(data.department_id)
		// 				.success(function(data){
		// 					$scope.result.paginated.push(data.data);
		// 					$scope.result.show = true;

		// 					$scope.result.paginateLoad = function(){
		// 						// kills the function if ajax is busy or pagination reaches last page
		// 						if($scope.result.busy || ($scope.result.page > $scope.result.paginated.last_page)){
		// 							return;
		// 						}
		// 						/**
		// 						 * Executes pagination call
		// 						 *
		// 						*/
		// 						// sets to true to disable pagination call if still busy.
		// 						$scope.result.busy = true;

		// 						// Calls the next page of pagination.
		// 						Result.paginateDepartment(user.department_id$scope.result.page)
		// 							.success(function(data){
		// 								// increment the page to set up next page for next AJAX Call
		// 								$scope.result.page++;

		// 								// iterate over each data then splice it to the data array
		// 								angular.forEach(data.data, function(item, key){
		// 									$scope.result.paginated.push(item);
		// 								});

		// 								// Enables again the pagination call for next call.
		// 								$scope.result.busy = false;
		// 							});
		// 					}
		// 				})
		// 				.error(function(){
		// 					Preloader.error();
		// 				});
		// 		});
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
			// $scope.result.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			// $scope.result.show = false;
			// Preloader.preload()
			// Result.search($scope.result)
			// 	.success(function(data){
			// 		$scope.result.results = data;
			// 		Preloader.stop();
			// 	})
			// 	.error(function(data){
			// 		Preloader.error();
			// 	});
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
	.controller('reportContentContainerController', ['$scope', '$state', '$mdDialog', 'Preloader', 'Member', 'Project', 'Position', 'Performance', 'User', function($scope, $state, $mdDialog, Preloader, Member, Project, Position, Performance, User){		
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
		$scope.date_start = new Date();

		// $scope.setDate = function(date){
		// 	$scope.minDate = $scope.date_start.setDate($scope.date_start.getDate() + 5);
		// }
		// $scope.maxDate = $scope.details.maxDate;

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
