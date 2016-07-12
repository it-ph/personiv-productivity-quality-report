adminModule
	.controller('teamLeaderContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'User', function($scope, $mdDialog, Preloader, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'User Accounts';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'settings';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			$scope.init(true);
			// clear user
			// $scope.setting.all = [];
			// $scope.setting.page = 2;
			// User.teamLeader()
			// 	.success(function(data){
			// 		$scope.setting.all = data;
			// 		$scope.setting.all.show = true;
			// 		Preloader.stop();
			// 	})
			// 	.error(function(){
			// 		Preloader.stop();
			// 	});
		};

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
			$scope.setting.all.show = false;
			Preloader.preload()
			User.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'showMembersDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-members.dialog.template.html',
		      	parent: angular.element(document.body),
		      	clickOutsideToClose:true
		    })
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Team Leader';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    	controller: 'addTeamLeaderDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-team-leader.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

		$scope.init = function(refresh){
			/**
			 * Object for setting
			 *
			*/
			$scope.setting = {};
			User.teamLeader()
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.first_name.charAt(0).toUpperCase();
						item.created_at = new Date(item.created_at);
					});

					$scope.setting.all = data;
					$scope.setting.all.show = true;

					if(refresh){
						Preloader.stop();
						Preloader.stop();
					}
				});
		}

		$scope.init();
	}]);