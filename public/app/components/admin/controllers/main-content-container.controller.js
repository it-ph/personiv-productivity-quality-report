adminModule
	.controller('mainContentContainerController', ['$scope', '$state', 'Preloader', function($scope, $state, Preloader){
		
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
			// Preloader.preload();
			// // clear log
			// $scope.log.paginated = {};
			// $scope.log.page = 2;
			// Log.paginate()
			// 	.then(function(data){
			// 		$scope.log.paginated = data.data;
			// 		$scope.log.paginated.show = true;
			// 		// stop preload
			// 		Preloader.stop();
			// 	}, function(){
			// 		Preloader.error();
			// 	});
		};
		/**
		 * Object for log
		 *
		*/
		// $scope.log = {};
		// // 2 is default so the next page to be loaded will be page 2 
		// $scope.log.page = 2;
		//

		// Log.paginate()
		// 	.then(function(data){
		// 		$scope.log.paginated = data.data;
		// 		$scope.log.paginated.show = true;

		// 		$scope.log.paginateLoad = function(){
		// 			// kills the function if ajax is busy or pagination reaches last page
		// 			if($scope.log.busy || ($scope.log.page > $scope.log.paginated.last_page)){
		// 				return;
		// 			}
		// 			/**
		// 			 * Executes pagination call
		// 			 *
		// 			*/
		// 			// sets to true to disable pagination call if still busy.
		// 			$scope.log.busy = true;

		// 			// Calls the next page of pagination.
		// 			Log.paginate($scope.log.page)
		// 				.then(function(data){
		// 					// increment the page to set up next page for next AJAX Call
		// 					$scope.log.page++;

		// 					// iterate over each data then splice it to the data array
		// 					angular.forEach(data.data.data, function(item, key){
		// 						$scope.log.paginated.data.push(item);
		// 					});

		// 					// Enables again the pagination call for next call.
		// 					$scope.log.busy = false;
		// 				});
		// 		}
		// 	}, function(){
		// 		Preloader.error();
		// 	});

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
			// $scope.log.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			// $scope.log.paginated.show = false;
			// Preloader.preload()
			// Log.search($scope.log)
			// 	.success(function(data){
			// 		$scope.log.results = data;
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

		
	}]);