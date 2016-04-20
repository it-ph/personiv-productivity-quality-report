adminModule
	.controller('addWorkHoursDialogController', ['$scope', '$mdDialog', 'Preloader', 'Programme', function($scope, $mdDialog, Preloader, Programme){
		$scope.programme = {};
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addProgrammeForm.$invalid){
				angular.forEach($scope.addProgrammeForm.$error, function(field){
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
					Programme.store($scope.programme)
						.success(function(){
							// Stops Preloader 
							Preloader.stop();
							busy = false;
						}, function(){
							Preloader.error();
						});
				}
			}
		}
	}]);