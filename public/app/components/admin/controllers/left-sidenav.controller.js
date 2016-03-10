adminModule
	.controller('leftSidenavController', ['$scope', '$mdSidenav', 'Department', function($scope, $mdSidenav, Department){
		$scope.menu = {};

		$scope.menu.section = [
			{
				'name':'Weekly Report',
			},
			{
				'name':'Settings',
			},
		];

		$scope.menu.settings = [
			{
				'name':'Departments',
				'state':'main.department-settings',
			},
			{
				'name':'Team Leaders',
				'state':'main.team-leaders',
			},
		],

		/* AJAX Request Department */
		Department.index()
			.success(function(data){
				$scope.menu.departments =  data;
			});

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
	}]);