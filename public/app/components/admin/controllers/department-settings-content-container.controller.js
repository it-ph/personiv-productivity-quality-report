adminModule
	.controller('departmentSettingsContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Department', function($scope, $mdDialog, Preloader, Department){
		
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
			$scope.setting.all = {};
			$scope.setting.page = 2;
			Department.index()
				.success(function(data){
					$scope.setting.all = data;
					$scope.setting.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for setting
		 *
		*/
		$scope.setting = {};
		Department.index()
			.success(function(data){
				$scope.setting.all = data;
				$scope.setting.all.show = true;
			});

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
			Preloader.set(id);
			Preloader.setDepartment(id);
			$mdDialog.show({
		    	controller: 'showProjectsDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/show-projects.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(id){
		    	if(!id){
		    		$mdDialog.show({
				    	controller: 'addProjectDialogController',
				      	templateUrl: '/app/components/admin/templates/dialogs/add-project.dialog.template.html',
				      	parent: angular.element(document.body),
				    })
				    .then(function(){
				    	$scope.subheader.refresh();
				    })
		    	}
		    	else{
					Preloader.set(id);
					$mdDialog.show({
				    	controller: 'showPositionDialogController',
				      	templateUrl: '/app/components/admin/templates/dialogs/show-positions.dialog.template.html',
				      	parent: angular.element(document.body),
				    })
				    .then(function(id){
				    	if(!id){
					    	$mdDialog.show({
						    	controller: 'addPositionDialogController',
						      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
						      	parent: angular.element(document.body),
						    })
						    .then(function(){
						    	$scope.subheader.refresh();
						    })
				    	}
				    	else{
				    		Preloader.set(id);
				    		$mdDialog.show({
						    	controller: 'showTargetsDialogController',
						      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
						      	parent: angular.element(document.body),
						      	clickOutsideToClose: true,
						    })
				    	}
				    });
		    	}
		    })
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
	}]);