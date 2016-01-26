adminModule
	.controller('mainContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Report', 'User', function($scope, $state, $stateParams, $mdDialog, Preloader, Report, User){
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

		// fetch the details of the pagination 
		Report.paginateDetails()
			.success(function(data){
				$scope.report.details = data;
				$scope.report.busy = true;
				// fetch the custom paginated data
				Report.paginate()
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
							Report.paginate($scope.report.page)
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
			Report.paginateDetails()
				.success(function(data){
					$scope.report.details = data;
					// fetch the custom paginated data
					Report.paginate()
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
			$scope.charts.result.data = [];
			$scope.charts.result.series = [];
			Preloader.preload();
			Report.search($scope.toolbar)
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

		$scope.editReport = function(id){
			$state.go('main.edit-report', {'reportID':id});
		};
	}]);