adminModule
	.controller('editWorkHoursDialogController', ['$scope', '$mdDialog', 'Preloader', 'Programme', function($scope, $mdDialog, Preloader, Programme){
		var programmeID = Preloader.get();
		
		Programme.show(programmeID)
			.success(function(data){
				$scope.programme = data;
			})
			.error(function(){
				Preloader.error();
			});

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
					Programme.update(programmeID, $scope.programme)
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