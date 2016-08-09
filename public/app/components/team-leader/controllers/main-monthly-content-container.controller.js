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
		$scope.subheader.show = true;
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
							member.full_name = member.member.full_name;
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