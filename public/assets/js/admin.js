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
						templateUrl: '/app/components/admin/templates/content/main.content.template.html',
					},
				}
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
			.state('main.departments', {
				url: 'departments/{departmentID}',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'departmentContentContainerController',
					},
					'toolbar@main.departments': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.departments':{
						templateUrl: '/app/components/admin/templates/content/main.content.template.html',
					},
				}
			})
	}]);
adminModule
	.controller('departmentContentContainerController', ['$scope', '$stateParams', '$mdDialog', 'Preloader', 'Department', 'Performance', function($scope, $stateParams, $mdDialog, Preloader, Department, Performance){
		var departmentID = $stateParams.departmentID;
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Departments';

		Department.show(departmentID)
			.success(function(data){
				$scope.toolbar.childState = data.name;
			})
			.error(function(){
				Preloader.error();
			});

		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'departments';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear report
			$scope.report.all = {};
			$scope.report.page = 2;
			Performance.paginateDepartment(departmentID)
				.success(function(data){
					$scope.report.paginated = data.data;
					$scope.report.paginated.show = true;
					// stop preload
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		};
		/**
		 * Object for report
		 *
		*/
		$scope.report = {};

		// 2 is default so the next page to be loaded will be page 2 
		$scope.report.page = 2;
		//

		Performance.paginateDepartment(departmentID)
			.success(function(data){
				$scope.report.paginated = data.data;
				$scope.report.paginated.show = true;

				$scope.report.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.report.busy || ($scope.report.page > $scope.report.paginated.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.report.busy = true;

					// Calls the next page of pagination.
					Performance.paginateDepartment(departmentID, $scope.report.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.report.page++;

							// iterate over each data then splice it to the data array
							angular.forEach(data.data, function(item, key){
								$scope.report.paginated.push(item);
							});

							// Enables again the pagination call for next call.
							$scope.report.busy = false;
						});
				}
			})
			.error(function(){
				Preloader.error();
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
			$scope.report.all.show = false;
			Preloader.preload()
			Department.search($scope.toolbar)
				.success(function(data){
					$scope.report.results = data;
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
adminModule
	.controller('departmentSettingsContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		
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
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'Department', function($scope, $mdSidenav, Department){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Departments',
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
				Department.store($scope.department)
					.then(function(){
						// Stops Preloader 
						Preloader.stop();
					}, function(){
						Preloader.error();
					});
			}
		}
	}]);
adminModule
	.controller('addPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Position', 'Target', function($scope, $mdDialog, Preloader, Department, Position, Target){
		var departmentID = Preloader.get();

		$scope.position = {};
		$scope.position.department_id = departmentID;

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
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Beginner',
			},
			{
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'productivity',
				'label': 'Productivity',
				'experience': 'Experienced',
			},
		];

		$scope.quality = [
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Beginner',
			},
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Moderately Experienced',
			},
			{
				'type': 'quality',
				'label': 'Quality',
				'experience': 'Experienced',
			},
		];

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
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
				Position.store($scope.position)
					.success(function(data){
						angular.forEach($scope.productivity, function(item){
							item.position_id = data.id;
							item.department_id = departmentID;
						});

						angular.forEach($scope.quality, function(item){
							item.position_id = data.id;
							item.department_id = departmentID;
						});

						Target.store($scope.productivity)
							.success(function(){
								Target.store($scope.quality)
									.success(function(){
										// Stops Preloader
										Preloader.stop();
									});
							});

					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
adminModule
	.controller('addTargetDialogController', ['$scope', '$mdDialog', 'Preloader', 'Target', function($scope, $mdDialog, Preloader, Target){
		$scope.target = {};

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
				Target.store($scope.target)
					.then(function(){
						// Stops Preloader 
						Preloader.stop();
					}, function(){
						Preloader.error();
					});
			}
		}
	}]);
adminModule
	.controller('addTeamLeaderDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'User', function($scope, $mdDialog, Preloader, Department, User){
		$scope.user = {};

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
				User.store($scope.user)
					.then(function(){
						// Stops Preloader 
						Preloader.stop();
					}, function(){
						Preloader.error();
					});
			}
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
	.controller('showPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Position', function($scope, $mdDialog, Preloader, Department, Position){
		var departmentID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};
		
		$scope.add = function(){
			$mdDialog.hide();
		};

		$scope.showTargets = function(id){
			$mdDialog.hide(id);	
		};

		Position.department(departmentID)
			.success(function(data){
				$scope.positions = data;
			});

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

	}]);
adminModule
	.controller('showTargetsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Target', 'Position', function($scope, $mdDialog, Preloader, Target, Position){
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
//# sourceMappingURL=admin.js.map
