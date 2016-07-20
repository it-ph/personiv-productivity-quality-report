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

							
							angular.forEach(data.members, function(member, memberKey){
								data.charts.productivity.labels.push(member.member.full_name);
								data.charts.quality.labels.push(member.member.full_name);
								// angular.forEach(member.performances, function(performance){
									data.charts.productivity.data[0].push(member.monthly_productivity);
									data.charts.quality.data[0].push(member.monthly_quality);
								// });
							});


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
						$scope.report.current.splice(index, 1, data);
						// $scope.report.showCurrent = true;
						// createCharts(data);
					// }
				})
		}

		$scope.init = function(refresh, query){
			Report.departmentMonthly(query)
				.success(function(data){
					var createCharts = function(data){
						angular.forEach(data, function(project, projectKey){
							project.chartType = 'bar';

							project.charts = {};

							project.charts.productivity = {};
							project.charts.productivity.data = [[]];
							project.charts.productivity.series = ['Productivity'];
							project.charts.productivity.labels = [];
							
							project.charts.quality = {};
							project.charts.quality.data = [[]];
							project.charts.quality.series = ['Quality'];
							project.charts.quality.labels = [];

							
							angular.forEach(project.members, function(member, memberKey){
								project.charts.productivity.labels.push(member.member.full_name);
								project.charts.quality.labels.push(member.member.full_name);
								// angular.forEach(member.performances, function(performance){
									project.charts.productivity.data[0].push(member.monthly_productivity);
									project.charts.quality.data[0].push(member.monthly_quality);
								// });
							});
						});
					}

					if(query){
						$scope.haveResults = data ? true: false;
						$scope.report.results = data;
						$scope.report.showCurrent = false;

						createCharts(data);
					}
					else{
						$scope.haveCurrent = data ? true: false;
						$scope.report.current = data;
						$scope.report.showCurrent = true;
						createCharts(data);
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

		$scope.view = function(data){
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