teamLeaderModule
	.controller('performanceMonthlyViewDialogController', ['$scope', '$mdDialog', 'Performance', 'Preloader', function($scope, $mdDialog, Performance, Preloader){		
		$scope.member = Preloader.get();

		Performance.monthly($scope.member)
			.success(function(data){
				$scope.member = data;

				angular.forEach(data.positions, function(position){
					angular.forEach(position.performances, function(performance){
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					})
				});

				$scope.positions = data.positions;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);