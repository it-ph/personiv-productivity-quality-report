teamLeaderModule
	.controller('createMemberContentContainerController', ['$scope', '$state', 'Project', 'Member', 'Experience', 'Preloader', function($scope, $state, Project, Member, Experience, Preloader){
		$scope.form = {};
		$scope.member = {};
		$scope.member_projects = [];
		$scope.maxDate = new Date();

		Project.index()
			.success(function(data){
				$scope.projects = data;
				angular.forEach(data, function(item, key){
					$scope.member_projects.push({});
				});
			})
			.error(function(){
				Preloader.error();
			})

		var busy = false;
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.parentState = 'Members';
		$scope.toolbar.childState = 'Create';
		$scope.toolbar.showBack = true;
		$scope.toolbar.back = function(){
			$state.go('main.members');
		}
		$scope.toolbar.hideSearchIcon = true;

		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			$scope.submit();
		}

		$scope.checkDuplicate = function(){
			$scope.duplicate = false;
			Member.checkDuplicate($scope.member)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.submit = function(){
			if($scope.form.memberForm.$invalid){
				angular.forEach($scope.form.memberForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else{
				//  * Stores Single Record
				// Preloader.saving();

				// console.log($scope.member_projects);
				if(!busy){
					busy = true;

					Member.store($scope.member)
						.then(function(data){
							if(typeof(data.data) === "boolean"){
								busy = false;
								return;
							}
							else{
								return data.data;
							}
						})
						.then(function(memberID){
							if(memberID){
								angular.forEach($scope.member_projects, function(item){
									item.member_id = memberID;
									if(item.project){
										item.date_started = item.date_started.toDateString();
									}
								});

								Experience.store($scope.member_projects)
									.success(function(){
										$state.go('main.members');
										return;
									})
									.error(function(){
										busy = false;
										Preloader.error();
									});
							}

							return
						}, function(){
							busy = false;
							Preloader.error();
						});
				}
			}
		}

	}]);