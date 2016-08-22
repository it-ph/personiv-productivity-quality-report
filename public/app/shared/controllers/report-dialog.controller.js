sharedModule
	.controller('reportDialogController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'Report', function($scope, $filter, $mdDialog, Preloader, Report){
		var reportID = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Report.show(reportID)
			.success(function(data){
				data.date_start = new Date(data.date_start);
				data.date_end = new Date(data.date_end);

				angular.forEach(data.performances, function(performance){
					var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
					performance.experience = filter[0].experience;
					performance.date_start = new Date(performance.date_start);
					performance.date_end = new Date(performance.date_end);
				});
				
				$scope.report = data;
			})

	}]);