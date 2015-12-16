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
						// templateUrl: '/app/components/team-leader/templates/content/main.content.template.html',
					},
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
						// templateUrl: '/app/components/team-leader/templates/content/settings.content.template.html',
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
	.controller('mainContentContainerController', ['$scope', '$state', 'Preloader', function($scope, $state, Preloader){
		
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
			// Preloader.preload();
			// // clear log
			// $scope.log.paginated = {};
			// $scope.log.page = 2;
			// Log.paginate()
			// 	.then(function(data){
			// 		$scope.log.paginated = data.data;
			// 		$scope.log.paginated.show = true;
			// 		// stop preload
			// 		Preloader.stop();
			// 	}, function(){
			// 		Preloader.error();
			// 	});
		};
		/**
		 * Object for log
		 *
		*/
		// $scope.log = {};
		// // 2 is default so the next page to be loaded will be page 2 
		// $scope.log.page = 2;
		//

		// Log.paginate()
		// 	.then(function(data){
		// 		$scope.log.paginated = data.data;
		// 		$scope.log.paginated.show = true;

		// 		$scope.log.paginateLoad = function(){
		// 			// kills the function if ajax is busy or pagination reaches last page
		// 			if($scope.log.busy || ($scope.log.page > $scope.log.paginated.last_page)){
		// 				return;
		// 			}
		// 			/**
		// 			 * Executes pagination call
		// 			 *
		// 			*/
		// 			// sets to true to disable pagination call if still busy.
		// 			$scope.log.busy = true;

		// 			// Calls the next page of pagination.
		// 			Log.paginate($scope.log.page)
		// 				.then(function(data){
		// 					// increment the page to set up next page for next AJAX Call
		// 					$scope.log.page++;

		// 					// iterate over each data then splice it to the data array
		// 					angular.forEach(data.data.data, function(item, key){
		// 						$scope.log.paginated.data.push(item);
		// 					});

		// 					// Enables again the pagination call for next call.
		// 					$scope.log.busy = false;
		// 				});
		// 		}
		// 	}, function(){
		// 		Preloader.error();
		// 	});

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
			// $scope.log.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			// $scope.log.paginated.show = false;
			// Preloader.preload()
			// Log.search($scope.log)
			// 	.success(function(data){
			// 		$scope.log.results = data;
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
	.controller('reportContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		// $scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Report';
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
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'showPositionDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-positions.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(id){
		    	if(!id){
			    	$mdDialog.show({
				    	controller: 'addPositionDialogController',
				      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
				      	parent: angular.element(document.body),
				    })
				    .then(function(){
				    	$scope.subheader.refresh();
				    })
		    	}
		    	else{
		    		Preloader.set(id);
		    		$mdDialog.show({
				    	controller: 'showTargetsDialogController',
				      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
				      	parent: angular.element(document.body),
				      	clickOutsideToClose: true,
				    })
		    	}
		    });
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Department';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	$mdDialog.show({
	 //    		controller: 'addDepartmentDialogController',
		//       	templateUrl: '/app/components/admin/templates/dialogs/add-department.dialog.template.html',
		//       	parent: angular.element(document.body),
		//     })
		//     .then(function(){
		//     	$scope.subheader.refresh();
		//     })
		// };
	}]);
teamLeaderModule
	.controller('addMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'Position', 'User', 'Member', function($scope, $mdDialog, Preloader, Position, User, Member){
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

		Position.department(user.department_id)
			.success(function(data){
				$scope.positions = data;
			});

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
