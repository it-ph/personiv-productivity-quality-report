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
				performance.full_name = performance.member.full_name;
				performance.position = performance.position.name;
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