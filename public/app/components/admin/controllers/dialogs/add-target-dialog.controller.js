adminModule
	.controller('addTargetDialogController', ['$scope', '$mdDialog', 'Preloader', 'Target', function($scope, $mdDialog, Preloader, Target){
		$scope.target = {};
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addTargetForm.$invalid){
				angular.forEach($scope.addTargetForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				/* Starts Preloader */
				Preloader.preload();
				/**
				 * Stores Single Record
				*/
				if(!busy){
					busy = true;
					Target.store($scope.target)
						.then(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
							busy = false;
						});
				}
			}
		}
	}]);