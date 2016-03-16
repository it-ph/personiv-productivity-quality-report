adminModule
	.controller('approvalsContentContainerController', ['$scope', '$mdDialog', 'Approval', 'Preloader',  function($scope, $mdDialog, Approval, Preloader){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Approvals';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'approvals';
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.pending.show = false;
			$scope.pending.page = 2;
			$scope.approved.page = 2;
			$scope.declined.page = 2;

			Approval.pending()
				.success(function(data){
					$scope.pending.details = data;
					$scope.pending.paginated = data.data;
					
				
				Approval.approved()
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						

						Approval.declined()
							.success(function(data){
								$scope.declined.details = data;
								$scope.declined.paginated = data.data;

								$scope.pending.show = true;
								$scope.declined.show = true;
								$scope.approved.show = true;

								Preloader.stop();
							})
					})
				})

		}

		$scope.pending = {};
		$scope.approved = {};
		$scope.declined = {};

		$scope.pending.page = 2;
		$scope.approved.page = 2;
		$scope.declined.page = 2;


		/* Pending */
		Approval.pending()
			.success(function(data){
				$scope.pending.details = data;
				$scope.pending.paginated = data.data;
				$scope.pending.show = true;
				$scope.pending.busy = false;
				$scope.pending.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.pending.busy || ($scope.pending.page > $scope.pending.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.pending.busy = true;

					// Calls the next page of pagination.
					Approval.pending($scope.pending.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.pending.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.pending.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.pending.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		/* Approved */
		Approval.approved()
			.success(function(data){
				$scope.approved.details = data;
				$scope.approved.paginated = data.data;
				$scope.approved.show = true;
				$scope.approved.busy = false;
				$scope.approved.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.approved.busy || ($scope.approved.page > $scope.approved.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.approved.busy = true;

					// Calls the next page of pagination.
					Approval.approved($scope.approved.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.approved.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.approved.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.approved.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		/* Declined */
		Approval.declined()
			.success(function(data){
				$scope.declined.details = data;
				$scope.declined.paginated = data.data;
				$scope.declined.show = true;
				$scope.declined.busy = false;
				$scope.declined.paginateLoad = function(){
					// kills the function if ajax is busy or pagination reaches last page
					if($scope.declined.busy || ($scope.declined.page > $scope.declined.details.last_page)){
						return;
					}
					/**
					 * Executes pagination call
					 *
					*/
					// sets to true to disable pagination call if still busy.
					$scope.declined.busy = true;

					// Calls the next page of pagination.
					Approval.declined($scope.declined.page)
						.success(function(data){
							// increment the page to set up next page for next AJAX Call
							$scope.declined.page++;
							// iterate over each data then splice it to the data array
							angular.forEach(data, function(item, key){
								$scope.declined.paginated.push(item);
							});
							// Enables again the pagination call for next call.
							$scope.declined.busy = false;
						})
						error(function(){
							Preloader.error();
						});
				}
			})
			.error(function(){
				Preloader.error();
			});

		$scope.show = function(action, id){
			if(action=='update'){
				Preloader.set(id);
				$mdDialog.show({
			      controller: 'approvalsDialogController',
			      templateUrl: '/app/components/admin/templates/dialogs/approval.dialog.template.html',
			      parent: angular.element(document.body),
			    })
			    .then(function(){
			    	$scope.subheader.refresh();
			    });
			}
		}

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
			$scope.toolbar.userInput = '';
			$scope.searchBar = false;
		};
		
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
		};

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;


	}]);