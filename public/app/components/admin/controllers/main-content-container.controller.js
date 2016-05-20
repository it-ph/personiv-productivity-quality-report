adminModule
	.controller('mainContentContainerController', ['$scope', '$state', '$stateParams', '$mdDialog', 'Preloader', 'Report', 'User', 'Target', 'Programme', function($scope, $state, $stateParams, $mdDialog, Preloader, Report, User, Target, Programme){
		$scope.report = {};
		$scope.months = [
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
		var dateCreated = 2016;

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			});

		$scope.currentMonth = $scope.months[new Date().getMonth()];

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
			Preloader.preload();
			$scope.report = {};
			$scope.reports = [];
			$scope.charts = [];
			$scope.chart = {};
			$scope.chart.series = ['Productivity', 'Quality'];

			Report.monthly()
				.success(function(data){
					$scope.reports = data;
					
					angular.forEach(data, function(report, reportIdx){
						$scope.charts.push([{}]);
						$scope.charts[reportIdx].data = [];
						$scope.charts[reportIdx].data.push([]); // index 0 is productivity
						$scope.charts[reportIdx].data.push([]); // index 1 is quality
						$scope.charts[reportIdx].labels = [];
						$scope.charts[reportIdx].positions = [];
						if(report.length){
							angular.forEach(report[0].positions, function(position, keyPostion){
								$scope.charts[reportIdx].positions.push(position.name);
							});
							$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
						}

						angular.forEach(report, function(member, memberIdx){
							$scope.charts[reportIdx].labels.push(member.full_name);

							$scope.charts[reportIdx].data[0].push(member.productivity_average);
							$scope.charts[reportIdx].data[1].push(member.quality_average);
						});
					});

					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				})
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

		// $scope.rightSidenav = {};

		// $scope.rightSidenav.show = true;

		$scope.charts = [];
		$scope.chart = {};
		$scope.chart.series = ['Productivity', 'Quality'];

		Report.monthly()
			.success(function(data){
				$scope.reports = data;
				angular.forEach(data, function(report, reportIdx){
					$scope.charts.push([{}]);
					$scope.charts[reportIdx].data = [];
					$scope.charts[reportIdx].data.push([]); // index 0 is productivity
					$scope.charts[reportIdx].data.push([]); // index 1 is quality
					$scope.charts[reportIdx].labels = [];
					$scope.charts[reportIdx].positions = [];
					if(report.length){
						angular.forEach(report[0].positions, function(position, keyPostion){
							$scope.charts[reportIdx].positions.push(position.name);
						});
						$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
					}

					angular.forEach(report, function(member, memberIdx){
						$scope.charts[reportIdx].labels.push(member.full_name);

						$scope.charts[reportIdx].data[0].push(member.productivity_average);
						$scope.charts[reportIdx].data[1].push(member.quality_average);
					});
				});
			})
			.error(function(){
				Preloader.error();
			})

		$scope.form = {};

		$scope.searchMonthlyReport = function(){
			if($scope.form.searchMonthlyForm.$invalid){
				angular.forEach($scope.form.searchMonthlyForm.$error, function(field){
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
				Report.searchMonthly($scope.report)
					.success(function(data){
						$scope.reports = data;
						angular.forEach(data, function(report, reportIdx){
							$scope.charts.push([{}]);
							$scope.charts[reportIdx].data = [];
							$scope.charts[reportIdx].data.push([]); // index 0 is productivity
							$scope.charts[reportIdx].data.push([]); // index 1 is quality
							$scope.charts[reportIdx].labels = [];
							$scope.charts[reportIdx].positions = [];
							if(report.length){
								angular.forEach(report[0].positions, function(position, keyPostion){
									$scope.charts[reportIdx].positions.push(position.name);
								});
								$scope.charts[reportIdx].position_head_count = report[0].position_head_count;
							}

							angular.forEach(report, function(member, memberIdx){
								$scope.charts[reportIdx].labels.push(member.full_name);

								$scope.charts[reportIdx].data[0].push(member.productivity_average);
								$scope.charts[reportIdx].data[1].push(member.quality_average);
							});
						});
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					})
			}
		}

		$scope.test = function(data){
			Preloader.set(data);

			$mdDialog.show({
		    	controller: 'performanceMonthlyViewDialogController',
		    	templateUrl: '/app/components/admin/templates/dialogs/performance-monthly-view.dialog.template.html',
		    	parent: angular.element(document.body),
		      	clickOutsideToClose:true
		    });
		}
	}]);