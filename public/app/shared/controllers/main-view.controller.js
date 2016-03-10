sharedModule
	.controller('mainViewController', ['$scope', '$state', '$mdSidenav', '$mdToast', 'User', 'Preloader', 'Notification', function($scope, $state, $mdSidenav, $mdToast, User, Preloader, Notification){
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
				if($scope.user.role == 'admin'){
					var pusher = new Pusher('23a55307c335e49bc68a', {
				    	encrypted: true
				    });
				    
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
			});

		Notification.unseen()
    		.success(function(data){
    			$scope.notifications = data;
    		});

		$scope.viewNotification = function(idx){
			Notification.seen($scope.notifications[idx].id)
				.success(function(){
					$state.go('main.weekly-report', {'departmentID':$scope.notifications[idx].department_id});
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