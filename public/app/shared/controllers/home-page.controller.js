sharedModule
	.controller('homePageController', ['$scope', 'Department', function($scope, Department){
		$scope.show = function(){
			angular.element($('.main-view').removeClass('hidden-custom'));
		};

		Department.index()
			.success(function(data){
				$scope.departments = data;
			});
	}]);