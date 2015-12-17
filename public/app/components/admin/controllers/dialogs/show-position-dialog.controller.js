adminModule
	.controller('showPositionDialogController', ['$scope', '$mdDialog', 'Preloader', 'Project', 'Position', function($scope, $mdDialog, Preloader, Project, Position){
		var projectID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};
		
		$scope.add = function(){
			$mdDialog.hide();
		};

		$scope.showTargets = function(id){
			$mdDialog.hide(id);	
		};

		Position.project(projectID)
			.success(function(data){
				$scope.positions = data;
			});

		Project.show(projectID)
			.success(function(data){
				$scope.project = data;
			});

	}]);