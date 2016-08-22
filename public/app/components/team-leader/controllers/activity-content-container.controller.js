teamLeaderModule
	.controller('activityContentContainerController', ['$scope', '$mdDialog', 'Activity', 'Preloader', 'User',  function($scope, $mdDialog, Activity, Preloader, User){
		$scope.form = {};
		$scope.activity = {};
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

		$scope.activity.month = $scope.months[new Date().getMonth()];
		$scope.activity.year = new Date().getFullYear();
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.hideSearchIcon = true;
		$scope.toolbar.childState = 'Activities';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		
		$scope.subheader.refresh = function(){
			Preloader.preload();
			$scope.init(true);
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

		$scope.showDetails = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'reportDialogController',
		      	templateUrl: '/app/shared/templates/dialogs/report.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		}

		$scope.showHistory = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'performanceHistoryDialogController',
		      	templateUrl: '/app/shared/templates/dialogs/performance-history.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		}

		var formatItem = function(activity){
			activity.created_at = new Date(activity.created_at);
			activity.first_letter = activity.user.first_name.charAt(0).toUpperCase();

			return activity;
		}

		$scope.search = function(){
			Preloader.preload();
			/* Submitted */
			Activity.reportSubmitted($scope.activity)
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});

					$scope.submitted = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Updated */
			Activity.reportUpdated($scope.activity)
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});

					$scope.updated = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Deleted */
			Activity.reportDeleted($scope.activity)
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});

					Preloader.stop();
					Preloader.stop();

					$scope.deleted = data;
				})
				.error(function(){
					Preloader.error();
				});

		}

		$scope.init = function(refresh){
			/* Submitted */
			Activity.reportSubmitted()
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});
					$scope.submitted = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Updated */
			Activity.reportUpdated()
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});

					$scope.updated = data;
				})
				.error(function(){
					Preloader.error();
				});

			/* Deleted */
			Activity.reportDeleted()
				.success(function(data){
					angular.forEach(data, function(item){
						formatItem(item);
					});

					$scope.deleted = data;
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