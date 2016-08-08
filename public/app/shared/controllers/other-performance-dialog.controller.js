sharedModule
	.controller('otherPerformanceDialogController', ['$scope', '$mdDialog', 'Preloader', 'Performance', function($scope, $mdDialog, Preloader, Performance){
		$scope.performance = Preloader.get();

		$scope.member = $scope.performance.member;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Performance.weekly($scope.performance)
			.success(function(data){
				angular.forEach(data.positions, function(position){
					angular.forEach(position.performances, function(performance){
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					});
				});

				$scope.member = data;
				$scope.positions = data.positions;
			})

	}]);