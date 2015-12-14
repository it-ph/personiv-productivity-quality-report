adminModule
	.controller('showPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'Position', function($scope, $mdDialog, Preloader, Department, Position){
		var departmentID = Preloader.get();
		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Position.department(departmentID)
			.success(function(data){
				$scope.positions = data;
			});

		Department.show(departmentID)
			.success(function(data){
				$scope.department = data;
			});

		$scope.add = function(){
			$mdDialog.hide();
		};
	}]);