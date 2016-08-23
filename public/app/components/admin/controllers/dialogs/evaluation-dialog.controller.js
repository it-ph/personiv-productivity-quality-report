adminModule
	.controller('evaluateDialogController', ['$scope', '$mdDialog', '$filter', 'Preloader', 'Report', 'Performance', 'Project', 'Experience', 'Programme', 'Department', 'Member', function($scope, $mdDialog, $filter, Preloader, Report, Performance, Project, Experience, Programme, Department, Member){
		$scope.details = {};
		$scope.details.date_start = new Date();
		$scope.details.date_end = new Date();
		$scope.maxDate = new Date();

		Programme.index()
			.success(function(data){
				$scope.work_hours = data;
			})

		Department.index()
			.success(function(data){
				$scope.departments = data;
			})

		$scope.fetchProjects = function(){
			var departmentID = $scope.details.department;

			var department = $filter('filter')($scope.departments, {id: departmentID});	
			
			$scope.projects = department[0].projects;		
		}

		$scope.fetchMembers = function(){
			var projectID = $scope.details.project;

			Project.show(projectID)
				.success(function(data){
					$scope.positions = data.positions;					
				})

			Experience.members(projectID)
				.success(function(data){
					$scope.members = data;
				})
		}

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

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.submit = function(){
			if($scope.performanceEvaluationForm.$invalid){
				$scope.showErrors = true;
				angular.forEach($scope.performanceEvaluationForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				$scope.details.date_start = $scope.details.date_start.toDateString();
				$scope.details.date_end = $scope.details.date_end.toDateString();

				Performance.evaluation($scope.details.date_start, $scope.details.date_end, $scope.details.daily_work_hours, $scope.details.department, $scope.details.project, $scope.details.position, $scope.details.member)
					.success(function(data){
						Preloader.stop(data);
					})
					.error(function(){
						Preloader.error();
					})
			}
		}
	}]);