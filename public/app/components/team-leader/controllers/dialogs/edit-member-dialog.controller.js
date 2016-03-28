teamLeaderModule
	.controller('editMemberDialogController', ['$scope', '$mdDialog', 'Preloader', 'Member', function($scope, $mdDialog, Preloader, Member){
		var member_id = Preloader.get();
		var busy = false;

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		Member.show(member_id)
			.success(function(data){
				$scope.member = data;
			});

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.editMemberForm.$invalid){
				angular.forEach($scope.editMemberForm.$error, function(field){
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
					Member.update(member_id, $scope.member)
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