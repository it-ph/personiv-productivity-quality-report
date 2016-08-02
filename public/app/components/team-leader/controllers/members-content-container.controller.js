teamLeaderModule
	.controller('membersContentContainerController', ['$scope', '$state', '$mdDialog', 'Preloader', 'Member', 'User', function($scope, $state, $mdDialog, Preloader, Member, User){
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
			$scope.init(true);
		};
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';

		$scope.fab.action = function(){
			$state.go('main.create-member');
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

		$scope.editMember = function(id){
			$state.go('main.edit-member', {'memberID':id});
			// Preloader.set(id);
			// $mdDialog.show({
	  //   		controller: 'editMemberDialogController',
		 //      	templateUrl: '/app/components/team-leader/templates/dialogs/edit-member.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(){
		 //    	$scope.subheader.refresh();
		 //    })
		}

		$scope.deleteMember = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Member')
		        .content('This member will not be included to your report anymore.')
		        .ariaLabel('Delete Member')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm).then(function() {
		      Member.delete(id)
				.success(function(){
					$scope.subheader.refresh();
				});
		    }, function() {
		      return;
		    });			
		};

		$scope.init = function(refresh){
			$scope.member = {};
			User.index()
				.then(function(data){
					$scope.fab.show = data.data.role == 'team-leader' ? true : false;
					Member.department()
						.success(function(data){
							angular.forEach(data, function(member){
								member.first_letter = member.full_name.charAt(0).toUpperCase();
								angular.forEach(member.experiences, function(experience){
									experience.date_started = new Date(experience.date_started);
								});
							});

							$scope.member.all = data;
							$scope.member.all.show = true;
							$scope.option = true;

							if(refresh){
								Preloader.stop();
								Preloader.stop();
							}
						})
						.error(function(){
							Preloader.error();
						});
				}, function(){
					Preloader.error();
				})
		}

		$scope.init();
	}]);