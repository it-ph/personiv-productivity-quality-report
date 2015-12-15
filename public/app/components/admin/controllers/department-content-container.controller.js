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