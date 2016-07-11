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
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Member';

		$scope.fab.action = function(){
			$state.go('main.create-member');
			// $mdDialog.show({
	  //   		controller: 'addMemberDialogController',
		 //      	templateUrl: '/app/components/team-leader/templates/dialogs/add-member.dialog.template.html',
		 //      	parent: angular.element(document.body),
		 //    })
		 //    .then(function(){
		 //    	$scope.subheader.refresh();
		 //    })
		};
		/**
		 * Object for member
		 *
		*/
		$scope.user = Preloader.getUser();
		$scope.member = {};
		if(!$scope.user){
			// console.log('new')
			User.index()
				.success(function(data){
					$scope.toolbar.team_leader_id = data.id
					$scope.user = data;
					if(data.role=='team-leader')
					{
						Member.teamLeader(data.id)
							.success(function(data){
								angular.forEach(data, function(item){
									item.first_letter = item.full_name.charAt(0).toUpperCase();
								});

								$scope.member.all = data;
								$scope.member.all.show = true;
								$scope.option = true;
							});
					}
					else{
						Member.department(data.department_id)
							.success(function(data){
								angular.forEach(data, function(item){
									item.first_letter = item.full_name[0].toUpperCase();
								});

								$scope.member.all = data;
								$scope.member.all.show = true;
								$scope.option = false;
							});
					}
					$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
				});
		}
		else{
			// console.log('old');
			$scope.toolbar.team_leader_id = $scope.user.id
			$scope.fab.show = $scope.user.role == 'team-leader' ? true : false;
			if($scope.user.role=='team-leader')
			{
				Member.teamLeader($scope.user.id)
					.success(function(data){
						$scope.member.all = data;
						$scope.member.all.show = true;
						$scope.option = true;
					});
			}
			else{
				Member.department($scope.user.department_id)
					.success(function(data){
						$scope.member.all = data;
						$scope.member.all.show = true;
						$scope.option = false;
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
	}]);