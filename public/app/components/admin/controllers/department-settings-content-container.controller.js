adminModule
	.controller('departmentSettingsContentContainerController', ['$scope', '$state', '$mdDialog', 'Preloader', 'Department', function($scope, $state, $mdDialog, Preloader, Department){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Departments';
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
			// clear department
			$scope.init(true);
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
			Department.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			$state.go('main.projects', {'departmentID':id});
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Department';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    		controller: 'addDepartmentDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-department.dialog.template.html',
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
			Department.index()
				.success(function(data){
					angular.forEach(data, function(item){
						item.first_letter = item.name.charAt(0).toUpperCase();
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