sharedModule
	.service('Preloader', ['$mdDialog', function($mdDialog){
		var dataHolder = null;
		var user = null;
		var departmentID = null;
		var notification = {};
		return {
			/* Starts the preloader */
			preload: function(){
				return $mdDialog.show({
					templateUrl: '/app/shared/templates/preloader.html',
				    parent: angular.element(document.body),
				});
			},
			/* Stops the preloader */
			stop: function(data){
				$mdDialog.hide(data);
			},
			/* Shows error message if AJAX failed */
			error: function(){
				return $mdDialog.show(
			    	$mdDialog.alert()
				        .parent(angular.element($('body')))
				        .clickOutsideToClose(true)
				        .title('Oops! Something went wrong!')
				        .content('An error occured. Please contact administrator for assistance.')
				        .ariaLabel('Error Message')
				        .ok('Got it!')
				);
			},
			/* Send temporary data for retrival */
			set: function(data){
				dataHolder = data;
			},
			/* Retrieves data */
			get: function(){
				return dataHolder;
			},
			setUser: function(data){
				user = data;
			},
			getUser: function(){
				return user;
			},
			setDepartment: function(id){
				departmentID = id;
			},
			getDepartment: function(){
				return departmentID;
			},
			setNotification: function(data){
				notification = data;
			},
			getNotification: function(){
				return notification;
			},
		};
	}]);