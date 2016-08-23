sharedModule
	.controller('performanceEvaluationDialogController', ['$scope', '$mdDialog', 'Preloader', function($scope, $mdDialog, Preloader){
		$scope.evaluation = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);