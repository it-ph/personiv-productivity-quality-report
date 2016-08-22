sharedModule
	.controller('performanceHistoryDialogController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'PerformanceHistory', function($scope, $filter, $mdDialog, Preloader, PerformanceHistory){
		var activityID = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		PerformanceHistory.show(activityID)
			.success(function(data){
				data[0].activity.created_at = new Date(data[0].activity.created_at);
				data[0].first_letter = data[0].project.name.charAt(0);
				data[0].date_start = new Date(data[0].date_start);
				data[0].date_end = new Date(data[0].date_end);

				angular.forEach(data, function(item){
					angular.forEach(item.performances, function(performance){
						var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
						performance.experience = filter[0].experience;
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					});
				})
				
				$scope.history = data;
			})

	}]);