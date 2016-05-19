teamLeaderModule
	.controller('performanceMonthlyViewDialogController', ['$scope', '$mdDialog', 'Performance', 'Preloader', function($scope, $mdDialog, Performance, Preloader){		
		$scope.member = Preloader.get();

		Performance.monthly($scope.member.performances[0])
			.success(function(data){
				$scope.performances = data;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);