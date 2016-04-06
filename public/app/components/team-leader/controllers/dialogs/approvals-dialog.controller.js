teamLeaderModule
	.controller('approvalsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var approvalID = Preloader.get();
		$scope.user = Preloader.getUser();

		Approval.details(approvalID)
			.success(function(data){
				$scope.details = data;
			});
			
		$scope.markAll = function(){
			if($scope.checkAll)
			{
				$scope.checkAll = true;
			}
			else{
				$scope.checkAll = false;
			}
			angular.forEach($scope.details.request, function(item, key){
				item.include = !$scope.checkAll;
			});
		}
		
		$scope.cancel = function(){
			$mdDialog.cancel();
		}
		$scope.cancelRequest = function(){
			Preloader.preload();
			Approval.delete(approvalID)
				.success(function(){
					// Stops Preloader 
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}
	}]);