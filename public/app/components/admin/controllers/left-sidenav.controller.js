adminModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'Department', function($scope, $mdSidenav, Department){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Dashboard',
			},
			{
				'name':'Departments',
			},
		];

		$scope.menu.pages = [
			/* 0 */
			[
				// {
				// 	'name':'Analysis',
				// 	'state':'main.analysis',
				// },
				{
					'name':'Floor Plan',
					'state':'main.floor-plan',
				},
			],
		];

		/* AJAX Request Department */
		Department.index()
			.success(function(data){
				$scope.menu.pages.push(data);
			});

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);