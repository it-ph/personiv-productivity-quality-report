teamLeaderModule
	.controller('membersContentContainerController', ['$scope', '$mdDialog', 'Preloader', 'Member', 'User', function($scope, $mdDialog, Preloader, Member, User){
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Members';
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'members';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			// start preloader
			Preloader.preload();
			// clear member
			$scope.member.all = {};
			$scope.member.page = 2;
			Member.teamLeader($scope.toolbar.team_leader_id)
				.success(function(data){
					$scope.member.all = data;
					$scope.member.all.show = true;
					Preloader.stop();
				})
				.error(function(){
					Preloader.stop();
				});
		};
		/**
		 * Object for member
		 *
		*/
		var user = Preloader.getUser();
		$scope.member = {};
		if(!user){
			User.index()
				.success(function(data){
					$scope.toolbar.team_leader_id = data.id
					Member.teamLeader(data.id)
						.success(function(data){
							$scope.member.all = data;
							$scope.member.all.show = true;
						});
				});
		}
		else{
			$scope.toolbar.team_leader_id = user.id
			Member.teamLeader(user.id)
				.success(function(data){
					$scope.member.all = data;
					$scope.member.all.show = true;
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
			$scope.member.all.show = false;
			Preloader.preload()
			Member.search($scope.toolbar)
				.success(function(data){
					$scope.member.results = data;
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		$scope.show = function(id){
			Preloader.set(id);
			// $mdDialog.show({
		 //    	controller: 'showPositionDialogController',
		 //      	templateUrl: '/app/components/admin/templates/dialogs/show-positions.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(id){
		 //    	if(!id){
			//     	$mdDialog.show({
			// 	    	controller: 'addPositionDialogController',
			// 	      	templateUrl: '/app/components/admin/templates/dialogs/add-position.dialog.template.html',
			// 	      	parent: angular.element(document.body),
			// 	    })
			// 	    .then(function(){
			// 	    	$scope.subheader.refresh();
			// 	    })
		 //    	}
		 //    	else{
		 //    		Preloader.set(id);
		 //    		$mdDialog.show({
			// 	    	controller: 'showTargetsDialogController',
			// 	      	templateUrl: '/app/components/admin/templates/dialogs/show-targets.dialog.template.html',
			// 	      	parent: angular.element(document.body),
			// 	      	clickOutsideToClose: true,
			// 	    })
		 //    	}
		 //    });
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';
		
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$mdDialog.show({
	    		controller: 'addMemberDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/add-member.dialog.template.html',
		      	parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$scope.subheader.refresh();
		    })
		};
	}]);