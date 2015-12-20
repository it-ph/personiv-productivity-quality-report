teamLeaderModule
	.controller('mainContentContainerController', ['$scope', '$state', 'Preloader', 'Result', 'User', function($scope, $state, Preloader, Result, User){
		var user = Preloader.getUser();
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Dashboard';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'dashboard';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear result
			$scope.result.paginated = {};
			$scope.result.page = 2;
			Result.paginateDepartment(user.department_id)
				.then(function(data){
					$scope.result.paginated = data.data;
					$scope.result.show = true;
					// stop preload
					Preloader.stop();
				}, function(){
					Preloader.error();
				});
		};

		$scope.data = [
			// Productivity / Quality
			[90,100],
			[80,100],
			[90,90],
			[85,100],
			[70,100],
			[110,95],
			[120,90],
			[95,95],
			[120,90],
			[100,100],
		];

		$scope.labels = ['Productivity', 'Quality'];

		$scope.series = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
		/**
		 * Object for result
		 *
		*/
		$scope.result = {};
		$scope.result.paginated = [];
		// 2 is default so the next page to be loaded will be page 2 
		$scope.result.page = 2;
		
		// if(!user){
		// 	User.index()
		// 		.success(function(data){
		// 			user = data;

		// 			Result.paginateDepartment(data.department_id)
		// 				.success(function(data){
		// 					$scope.result.paginated.push(data.data);
		// 					$scope.result.show = true;

		// 					$scope.result.paginateLoad = function(){
		// 						// kills the function if ajax is busy or pagination reaches last page
		// 						if($scope.result.busy || ($scope.result.page > $scope.result.paginated.last_page)){
		// 							return;
		// 						}
		// 						/**
		// 						 * Executes pagination call
		// 						 *
		// 						*/
		// 						// sets to true to disable pagination call if still busy.
		// 						$scope.result.busy = true;

		// 						// Calls the next page of pagination.
		// 						Result.paginateDepartment(user.department_id$scope.result.page)
		// 							.success(function(data){
		// 								// increment the page to set up next page for next AJAX Call
		// 								$scope.result.page++;

		// 								// iterate over each data then splice it to the data array
		// 								angular.forEach(data.data, function(item, key){
		// 									$scope.result.paginated.push(item);
		// 								});

		// 								// Enables again the pagination call for next call.
		// 								$scope.result.busy = false;
		// 							});
		// 					}
		// 				})
		// 				.error(function(){
		// 					Preloader.error();
		// 				});
		// 		});
		// }

		/**
		 * Status of search bar.
		 *
		*/
		$scope.searchBar = false;

		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			// $scope.result.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			// $scope.result.show = false;
			// Preloader.preload()
			// Result.search($scope.result)
			// 	.success(function(data){
			// 		$scope.result.results = data;
			// 		Preloader.stop();
			// 	})
			// 	.error(function(data){
			// 		Preloader.error();
			// 	});
		};

		// $scope.show = function(id){
		// 	$state.go('main.units', {'assetID': $stateParams.assetID, 'unitID':id});
		// };
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	return;
		// };

		$scope.rightSidenav = {};

		$scope.rightSidenav.show = true;
	}]);