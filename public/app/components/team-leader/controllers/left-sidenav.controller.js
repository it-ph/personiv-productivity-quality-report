teamLeaderModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
		$scope.menu = {};
		$scope.menu.section = [
			{
				'name':'Dashboard',
				'state':'main',
				'icon':'mdi-view-dashboard',
				'tip': 'Dashboard: tracks your team\'s weekly performance, targets, and top performers.',
			},
			{
				'name':'Approvals',
				'state':'main.approvals',
				'icon':'mdi-file-document-box',
				'tip': 'Approvals: shows pending request for report changes.',
			},
			{
				'name':'Members',
				'state': 'main.members',
				'icon':'mdi-account-multiple',
				'tip': 'Members: manage people in your team.',
			},
			{
				'name':'Report',
				'state': 'main.report',
				'icon':'mdi-file-document',
				'tip': 'Report: submit team\'s weekly reports',
			},
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);