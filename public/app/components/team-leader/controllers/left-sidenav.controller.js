teamLeaderModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Dashboard',
				'state':'main',
				'icon':'mdi-view-dashboard',
			},
			{
				'name':'Members',
				'state': 'main.members',
				'icon':'mdi-account-multiple',
			},
			{
				'name':'Report',
				'state': 'main.report',
				'icon':'mdi-file-document',
			},
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);