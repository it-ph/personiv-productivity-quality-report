adminModule
	.controller('showProjectsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Project', function($scope, $mdDialog, Preloader, Department, Project){
		var departmentID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};
		
		$scope.add = function(){
			$mdDialog.hide();
		};

		$scope.showPositions = function(id){
			$mdDialog.hide(id);	
		};

		Project.department(departmentID)
			.success(function(data){
				$scope.projects = data;
			});

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

	}]);