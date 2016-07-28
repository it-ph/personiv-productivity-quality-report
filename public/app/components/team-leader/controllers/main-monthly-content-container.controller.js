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

		$scope.changePosition = function(data, index, current){
			Report.departmentMonthlyPosition(data)
				.success(function(data){
					// var createCharts = function(data){
					// 	angular.forEach(data, function(project, projectKey){
							data.chartType = 'bar';

							data.charts = {};

							data.charts.productivity = {};
							data.charts.productivity.data = [[]];
							data.charts.productivity.series = ['Productivity'];
							data.charts.productivity.labels = [];
							
							data.charts.quality = {};
							data.charts.quality.data = [[]];
							data.charts.quality.series = ['Quality'];
							data.charts.quality.labels = [];

							data.beginner_total_output = 0;
							data.beginner_total_man_hours = 0;
							data.beginner_total_average_output = 0;

							data.moderately_experienced_total_output = 0;
							data.moderately_experienced_total_man_hours = 0;
							data.moderately_experienced_total_average_output = 0;							
							
							data.experienced_total_output = 0;
							data.experienced_total_man_hours = 0;
							data.experienced_total_average_output = 0;

							
							angular.forEach(data.members, function(member, memberKey){
								data.charts.productivity.labels.push(member.member.full_name);
								data.charts.quality.labels.push(member.member.full_name);
								// angular.forEach(member.performances, function(performance){
									data.charts.productivity.data[0].push(member.monthly_productivity);
									data.charts.quality.data[0].push(member.monthly_quality);
								// });
							});

							angular.forEach(data.reports, function(report, reportKey){
								var beginners = $filter('filter')(report.members, {'experience':'Beginner'}, true);
								var moderately_experienced = $filter('filter')(report.members, {'experience':'Moderately Experienced'}, true);
								var experienced = $filter('filter')(report.members, {'experience':'Experienced'}, true);

								angular.forEach(beginners, function(beginner, beginnerKey){
									if(beginner.performance){
										data.beginner_total_output += beginner.performance.output;
										data.beginner_total_man_hours += beginner.performance.hours_worked;
										data.beginner_total_average_output += beginner.performance.average_output;
									}
								});

								angular.forEach(moderately_experienced, function(moderately_experienced, moderatelyExperiencedKey){
									if(moderately_experienced.performance){
										data.moderately_experienced_total_output += moderately_experienced.performance.output;
										data.moderately_experienced_total_man_hours += moderately_experienced.performance.hours_worked;
										data.moderately_experienced_total_average_output += moderately_experienced.performance.average_output;
									}
								});

								angular.forEach(experienced, function(experienced, experiencedKey){
									if(experienced.performance){
										data.experienced_total_output += experienced.performance.output;
										data.experienced_total_man_hours += experienced.performance.hours_worked;
										data.experienced_total_average_output += experienced.performance.average_output;
									}
								});
							});

							data.overall_total_output = data.beginner_total_output + data.moderately_experienced_total_output + data.experienced_total_output;
							data.overall_total_man_hours = data.beginner_total_man_hours + data.moderately_experienced_total_man_hours + data.experienced_total_man_hours;
							data.overall_total_average_output = data.beginner_total_average_output + data.moderately_experienced_total_average_output + data.experienced_total_average_output;

						// });
					// }

					// if(query){
					// 	$scope.haveResults = data ? true: false;
					// 	$scope.report.results = data;
					// 	$scope.report.showCurrent = false;

					// 	createCharts(data);
					// }
					// else{
						// $scope.haveCurrent = data ? true: false;
						if(current){
							$scope.report.current.splice(index, 1, data);
						}
						else{
							$scope.report.results.splice(index, 1, data);
						}
						// $scope.report.showCurrent = true;
						// createCharts(data);
					// }
				})
		}

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

					if(query){
						$scope.haveResults = data ? true: false;
						$scope.report.results = data;
						$scope.report.showCurrent = false;

						// createCharts(data);
					}
					else{
						$scope.haveCurrent = data ? true: false;
						$scope.report.current = data;
						$scope.report.showCurrent = true;
						// createCharts(data);
						console.log($scope.report.current);
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