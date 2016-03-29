adminModule
	.controller('approvalsDialogController', ['$scope', '$mdDialog', 'Approval', 'PerformanceApproval', 'Preloader', function($scope, $mdDialog, Approval, PerformanceApproval, Preloader){
		var approvalID = Preloader.get();
		var count = 0;

		Approval.details(approvalID)
			.success(function(data){
				$scope.details = data;
				$scope.show = true;
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


		$scope.approve = function(){
			Preloader.preload();
			if($scope.details.action == 'update'){
				Approval.approve($scope.details.request)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
			else{
				Approval.approveDelete($scope.details)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();	
					})
			}
		}

		$scope.decline = function(){
			Preloader.preload();
			if($scope.details.action == 'update'){
				Approval.decline($scope.details.request)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
			else{
				Approval.declineDelete($scope.details)
					.success(function(){
						// Stops Preloader 
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();	
					})
			}
		}
	}]);