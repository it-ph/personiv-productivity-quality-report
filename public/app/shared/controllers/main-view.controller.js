sharedModule
	.controller('mainViewController', ['$scope', '$state', '$mdSidenav', '$mdToast', '$mdDialog', 'User', 'Preloader', 'Notification', 'WalkThrough', function($scope, $state, $mdSidenav, $mdToast, $mdDialog, User, Preloader, Notification, WalkThrough){
		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		    })
		    .then(function(){
		    	$mdToast.show(
		    		$mdToast.simple()
				        .content('Password changed.')
				        .position('bottom right')
				        .hideDelay(3000)
		    	);
		    });
		}

		// $scope.startTour = function(){
		// 	$scope.leftSidenavTour = 0;
		// }
		/**
		 * Fetch authenticated user information
		 *
		*/
		User.index()
			.success(function(data){
				$scope.user = data;
				Preloader.setUser(data);
				/**
				 * Pusher
				 *
				*/
				var pusher = new Pusher('23a55307c335e49bc68a', {
			    	encrypted: true
			    });
				if($scope.user.role == 'admin'){
				    
				    var channel = pusher.subscribe('notifications');
				    
				    channel.bind('App\\Events\\ReportSubmittedBroadCast', function(data) {
				    	Preloader.setNotification(data.data);
				    	// pops out the toast
				    	$mdToast.show({
					    	controller: 'notificationToastController',
					      	templateUrl: '/app/components/admin/templates/toasts/notification.toast.html',
					      	parent : angular.element($('body')),
					      	hideDelay: 6000,
					      	position: 'bottom right'
					    });
				    	// updates the notification menu
				    	Notification.unseen()
				    		.success(function(data){
				    			$scope.notifications = data;
				    		});
				    });
				}
				else{
					WalkThrough.show($scope.user.id)
						.success(function(data){
							$scope.leftSidenavTour = data ? -1 : 0;
						});

					$scope.toolbarTour = function(){
						$scope.toolbarTour = 0;
					}
					var channel = pusher.subscribe('approvals.' + $scope.user.id);
				    
				    channel.bind('App\\Events\\ApprovalNotificationBroadCast', function(data) {
				    	Preloader.setNotification(data.data);
				    	// pops out the toast
				    	$mdToast.show({
					    	controller: 'notificationToastController',
					      	templateUrl: '/app/components/team-leader/templates/toasts/notification.toast.html',
					      	parent : angular.element($('body')),
					      	hideDelay: 6000,
					      	position: 'bottom right'
					    });
				    	// updates the notification menu
				    	Notification.unseen()
				    		.success(function(data){
				    			$scope.notifications = data;
				    		});
				    });
				}
			});

		Notification.unseen()
    		.success(function(data){
    			$scope.notifications = data;
    		});

		$scope.viewNotification = function(idx){
			Notification.seen($scope.notifications[idx].id)
				.success(function(){
					if($scope.notifications[idx].state == 'main.weekly-report'){
						$state.go('main.weekly-report', {'departmentID':$scope.notifications[idx].department_id});
					}
					else{
						$state.go('main.approvals');
					}
						$scope.notifications.splice(idx, 1);
				})
				.error(function(){
					Preloader.error();
				});
		}
		/**
		 * Toggles Left Sidenav
		 *
		*/
		$scope.toggleSidenav = function(menuId) {
		    $mdSidenav(menuId).toggle();
		};

	}]);