adminModule
	.controller('downloadReportDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', 'Programme', function($scope, $mdDialog, $filter, Preloader, Report, Performance, Programme){
		$scope.details = {};
		$scope.details.type = 'Weekly';

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			})

		// $scope.hours = [7.5, 8.3, 9.1];

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
		
		var dateCreated = 2016;

		// will generate the dates that will be used in drop down menu
		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.details.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.details.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.details.date_end = null;
			$scope.details.date_start = null;
			$scope.details.weekend = [];
			Performance.getMondays($scope.details)
				.success(function(data){
					$scope.mondays = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getWeekends = function(){	
			$scope.details.date_end = null;	
			$scope.details.weekend = [];
			Performance.getWeekends($scope.details)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.submit = function(){
			if($scope.downloadReportForm.$invalid){
				$scope.showErrors = true;
				angular.forEach($scope.downloadReportForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				if($scope.details.type=='Weekly')
				{
					var win = window.open('/report-download-summary/' + $filter('date')($scope.details.date_start, 'yyyy-MM-dd') + '/to/' + $filter('date')($scope.details.date_end, 'yyyy-MM-dd') + '/daily-work-hours/' + $scope.details.daily_work_hours , '_blank');
					win.focus();
				}
				else if($scope.details.type=='Monthly'){
					var win = window.open('/report-download-monthly-summary/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours, '_blank');
					win.focus();	
				}
				else if($scope.details.type=='Team Performance'){
					var win = window.open('/report-team-performance/' + $scope.details.month + '/year/' + $scope.details.year + '/daily-work-hours/' + $scope.details.daily_work_hours, '_blank');
					win.focus();	
				}

				$mdDialog.hide();
			}
		}
	}]);