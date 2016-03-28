adminModule
	.controller('addTeamLeaderDialogController', ['$scope', '$mdDialog', 'Preloader', 'Department', 'User', function($scope, $mdDialog, Preloader, Department, User){
		$scope.user = {};
		var busy = false;
		Department.index()
			.success(function(data){
				$scope.departments = data;
			});

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.submit = function(){
			if($scope.addTeamLeaderForm.$invalid){
				angular.forEach($scope.addTeamLeaderForm.$error, function(field){
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
					User.store($scope.user)
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