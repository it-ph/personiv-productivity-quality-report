adminModule
	.controller('mainViewController', ['$scope', '$mdSidenav', 'User', function($scope, $mdSidenav, User){
		/**
		 * Fetch authenticated user information
		 *
		*/
		User.index()
			.success(function(data){
				$scope.user = data;
			});

		/**
		 * Toggles Left Sidenav
		 *
		*/
		$scope.toggleSidenav = function(menuId) {
		    $mdSidenav(menuId).toggle();
		};
	}]);