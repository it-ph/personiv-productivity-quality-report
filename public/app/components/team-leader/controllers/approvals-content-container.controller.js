teamLeaderModule
	.controller('approvalsContentContainerController', ['$scope', '$mdDialog', 'PerformanceApproval', 'Approval', 'Preloader', 'User',  function($scope, $mdDialog, PerformanceApproval, Approval, Preloader, User){
		User.index()
			.success(function(data){
				$user = data;

				$scope.pending = {};
				$scope.approved = {};
				$scope.declined = {};

				$scope.pending.page = 2;
				$scope.approved.page = 2;
				$scope.declined.page = 2;


				/* Pending */
				Approval.pendingUser($user.id)
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
							Approval.pendingUser($user.id, $scope.pending.page)
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
				PerformanceApproval.approvedUser($user.id)
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
							PerformanceApproval.approvedUser($user.id, $scope.approved.page)
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
				PerformanceApproval.declinedUser($user.id)
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
							PerformanceApproval.declinedUser($user.id, $scope.declined.page)
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
			});
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
			$scope.approved.show = false;
			$scope.declined.show = false;
			$scope.pending.page = 2;
			$scope.approved.page = 2;
			$scope.declined.page = 2;

			Approval.pendingUser($user.id)
				.success(function(data){
					$scope.pending.details = data;
					$scope.pending.paginated = data.data;
					
				
				PerformanceApproval.approved($user.id)
					.success(function(data){
						$scope.approved.details = data;
						$scope.approved.paginated = data.data;
						

						PerformanceApproval.declined($user.id)
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

		$scope.showPending = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvalsDialogController',
		      templateUrl: '/app/components/team-leader/templates/dialogs/approval.dialog.template.html',
		      parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    });
		}

		$scope.showApprovedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    });
		}

		$scope.showDeclinedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'declinedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    });
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