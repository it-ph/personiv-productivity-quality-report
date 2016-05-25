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
							parentItem.chartType = 'bar';
									
							parentItem.charts = {};
							
							parentItem.charts.productivity = {};
							parentItem.charts.productivity.data = [[]];
							parentItem.charts.productivity.series = ['Productivity'];
							parentItem.charts.productivity.labels = [];
							
							parentItem.charts.quality = {};
							parentItem.charts.quality.data = [[]];
							parentItem.charts.quality.series = ['Quality'];
							parentItem.charts.quality.labels = [];

							angular.forEach(parentItem, function(item, key){
								parentItem.charts.productivity.data[0].push(item.productivity);
								parentItem.charts.quality.data[0].push(item.quality);
								parentItem.charts.productivity.labels.push(item.full_name);
								parentItem.charts.quality.labels.push(item.full_name);
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
										parentItem.chartType = 'bar';
									
										parentItem.charts = {};

										parentItem.charts.productivity = {};
										parentItem.charts.productivity.data = [[]];
										parentItem.charts.productivity.series = ['Productivity'];
										parentItem.charts.productivity.labels = [];
										
										parentItem.charts.quality = {};
										parentItem.charts.quality.data = [[]];
										parentItem.charts.quality.series = ['Quality'];
										parentItem.charts.quality.labels = [];

										angular.forEach(parentItem, function(item, key){
											parentItem.charts.productivity.data[0].push(item.productivity);
											parentItem.charts.quality.data[0].push(item.quality);
											parentItem.charts.productivity.labels.push(item.full_name);
											parentItem.charts.quality.labels.push(item.full_name);
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
			$scope.subheader.project = '';
			// start preloader
			Preloader.preload();
			// clear report
			$scope.report.paginated = [];
			$scope.report.targets = [];
			$scope.report.page = 2;

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
								parentItem.chartType = 'bar';

								parentItem.charts.productivity = {};
								parentItem.charts.productivity.data = [[]];
								parentItem.charts.productivity.series = ['Productivity'];
								parentItem.charts.productivity.labels = [];
								
								parentItem.charts.quality = {};
								parentItem.charts.quality.data = [[]];
								parentItem.charts.quality.series = ['Quality'];
								parentItem.charts.quality.labels = [];

								angular.forEach(parentItem, function(item, key){
									parentItem.charts.productivity.data[0].push(item.productivity);
									parentItem.charts.quality.data[0].push(item.quality);
									parentItem.charts.productivity.labels.push(item.full_name);
									parentItem.charts.quality.labels.push(item.full_name);
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
						parentItem.chartType = 'bar';
						parentItem.charts = {};
						parentItem.charts.productivity = {};
						parentItem.charts.productivity.data = [[]];
						parentItem.charts.productivity.series = ['Productivity'];
						parentItem.charts.productivity.labels = [];
						
						parentItem.charts.quality = {};
						parentItem.charts.quality.data = [[]];
						parentItem.charts.quality.series = ['Quality'];
						parentItem.charts.quality.labels = [];

						angular.forEach(parentItem, function(item, key){
							parentItem.charts.productivity.data[0].push(item.productivity);
							parentItem.charts.quality.data[0].push(item.quality);
							parentItem.charts.productivity.labels.push(item.full_name);
							parentItem.charts.quality.labels.push(item.full_name);
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