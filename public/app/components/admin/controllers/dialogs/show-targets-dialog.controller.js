adminModule
	.controller('showTargetsDialogController', ['$scope', '$mdDialog', 'Preloader', 'Target', 'Position', function($scope, $mdDialog, Preloader, Target, Position){
		var positionID = Preloader.get();
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		Position.show(positionID)
			.success(function(data){
				$scope.position = data;
			});

		Target.position(positionID)
			.success(function(data){
				$scope.targets = data;
			});
	}]);