teamLeaderModule
	.controller('approvalsContentContainerController', ['$scope', '$mdDialog', 'PerformanceApproval', 'Approval', 'Preloader', 'User',  function($scope, $mdDialog, PerformanceApproval, Approval, Preloader, User){
		$scope.form = {};
		$scope.approval = {};
		$scope.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		var dateCreated = 2016;

		$scope.years = [];

		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.approval.month = $scope.months[new Date().getMonth()];
		$scope.approval.year = new Date().getFullYear();
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.hideSearchIcon = true;
		$scope.toolbar.childState = 'Approvals';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'approvals';
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
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
		    	// $state.go($state.current, {}, {reload:true});
		    });
		}

		$scope.showApprovedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'approvedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/approved-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    	// $state.go($state.current, {}, {reload:true});
		    });
		}

		$scope.showDeclinedDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		      controller: 'declinedApprovalsDetailsDialogController',
		      templateUrl: '/app/components/admin/templates/dialogs/declined-approval-details.dialog.template.html',
		      parent: angular.element(document.body),
		      clickOutsideToClose:true,
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    	// $state.go($state.current, {}, {reload:true});
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

		$scope.search = function(){
			Preloader.preload();
			/* Pending */
			Approval.pendingUser($scope.approval)
				.success(function(data){
					$scope.pendingApprovals = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Approved */
			PerformanceApproval.approvedUser($scope.approval)
				.success(function(data){
					$scope.approved = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Declined */
			PerformanceApproval.declinedUser($scope.approval)
				.success(function(data){
					$scope.declined = data;
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});

		}

		$scope.init = function(refresh){
			/* Pending */
			Approval.pendingUser()
				.success(function(data){
					$scope.pendingApprovals = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Approved */
			PerformanceApproval.approvedUser()
				.success(function(data){
					$scope.approved = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Declined */
			PerformanceApproval.declinedUser()
				.success(function(data){
					$scope.declined = data;
				})
				.error(function(){
					Preloader.error();
				});

			if(refresh){
				Preloader.stop();
			}
		}

		$scope.init();
	}]);