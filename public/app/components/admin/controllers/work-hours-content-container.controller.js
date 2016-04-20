adminModule
	.controller('workHoursContentContainerController', ['$scope', '$mdDialog', 'Programme', 'Preloader', function($scope, $mdDialog, Programme, Preloader){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Work Hours';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'work-hours';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear user
			$scope.setting.all = [];
			Programme.index()
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
		Programme.index()
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
			Programme.search($scope.toolbar)
				.success(function(data){
					$scope.setting.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};
/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Work Hours';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
		    	controller: 'addWorkHoursDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};

		$scope.edit = function(id){
			Preloader.set(id);
			$mdDialog.show({
		    	controller: 'editWorkHoursDialogController',
		      	templateUrl: '/app/components/admin/templates/dialogs/add-work-hours.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		}

		$scope.delete = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Work Hour Scheme')
		        .content('Are you sure you want to delete this work hour scheme?')
		       	.ariaLabel('Delete Work Hour Scheme')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		    	Programme.delete(id)
		    		.success(function(){
		    			$scope.subheader.refresh();
		    		})
		    		.error(function(){
		    			Preloader.error();
		    		})
		    }, function() {
		    	return;
		    });
		}
	}]);