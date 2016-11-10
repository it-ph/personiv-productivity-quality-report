var sharedModule = angular.module('sharedModule', [
	/* Vendor Dependencies */
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
	'chart.js',
	'mgcrea.ngStrap',
	'angular-tour',
	'angularMoment'
]);
sharedModule
	.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function($urlRouterProvider, $stateProvider, $mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.accentPalette('purple');
		
		/* Dark Theme - Blue */
		$mdThemingProvider.theme('dark', 'default')
	      	.primaryPalette('deep-purple')
			.accentPalette('pink')
			.dark();

		$urlRouterProvider
			.otherwise('/page-not-found')
			.when('', '/');

		$stateProvider
			.state('page-not-found',{
				url: '/page-not-found',
				templateUrl: '/app/shared/views/page-not-found.view.html',
			})
	}]);
sharedModule
	.controller('changePasswordDialogController', ['$scope', '$mdDialog', 'User', 'Preloader', function($scope, $mdDialog, User, Preloader){
		$scope.password = {};

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		$scope.checkPassword = function(){
			User.checkPassword($scope.password)
				.success(function(data){
					$scope.match = data;
					$scope.show = true;
				});
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.changePasswordForm.$invalid){
				angular.forEach($scope.changePasswordForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.password.old == $scope.password.new || $scope.password.new != $scope.password.confirm)
			{
				return;
			}
			else {
				Preloader.preload();

				User.changePassword($scope.password)
					.success(function(){
						Preloader.stop();
					})
					.error(function(){
						Preloader.error();
					});
			}
		}
	}]);
sharedModule
	.controller('homePageController', ['$scope', 'Department', function($scope, Department){
		$scope.show = function(){
			angular.element($('.main-view').removeClass('hidden-custom'));
		};

		Department.index()
			.success(function(data){
				$scope.departments = data;
			});
	}]);
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
				var pusher = new Pusher('95c0378bb7677e168674', {
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
				// else if ($scope.user.role == 'team-leader'){
				// 	WalkThrough.show($scope.user.id)
				// 		.success(function(data){
				// 			$scope.leftSidenavTour = data ? -1 : 0;
				// 		});

				// 	$scope.toolbarTour = function(){
				// 		$scope.toolbarTour = 0;
				// 	}
				// 	var channel = pusher.subscribe('approvals.' + $scope.user.id);
				    
				//     channel.bind('App\\Events\\ApprovalNotificationBroadCast', function(data) {
				//     	Preloader.setNotification(data.data);
				//     	// pops out the toast
				//     	$mdToast.show({
				// 	    	controller: 'notificationToastController',
				// 	      	templateUrl: '/app/components/team-leader/templates/toasts/notification.toast.html',
				// 	      	parent : angular.element($('body')),
				// 	      	hideDelay: 6000,
				// 	      	position: 'bottom right'
				// 	    });
				//     	// updates the notification menu
				//     	Notification.unseen()
				//     		.success(function(data){
				//     			$scope.notifications = data;
				//     		});
				//     });
				// }
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

		$scope.lock = true;

		$scope.sidenavLock = function(){
			$scope.lock = $scope.lock ? false : true;
		}

		/**
		 * Toggles Left Sidenav
		 *
		*/
		$scope.toggleSidenav = function(menuId) {
		    $mdSidenav(menuId).toggle();
		};

	}]);
sharedModule
	.controller('otherPerformanceDialogController', ['$scope', '$mdDialog', 'Preloader', 'Performance', function($scope, $mdDialog, Preloader, Performance){
		$scope.performance = Preloader.get();

		$scope.member = $scope.performance.member;
		$scope.member.total_hours_worked = 0;

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Performance.weekly($scope.performance)
			.success(function(data){
				data.total_hours_worked = 0;
				angular.forEach(data.positions, function(position){
					if(position.total_hours_worked){
						data.total_hours_worked += position.total_hours_worked;
					}

					angular.forEach(position.performances, function(performance){
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					});
				});

				$scope.member = data;
				$scope.positions = data.positions;
			})

	}]);
sharedModule
	.controller('performanceEvaluationDialogController', ['$scope', '$mdDialog', 'Preloader', function($scope, $mdDialog, Preloader){
		$scope.evaluation = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}
	}]);
sharedModule
	.controller('performanceHistoryDialogController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'PerformanceHistory', function($scope, $filter, $mdDialog, Preloader, PerformanceHistory){
		var activityID = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		PerformanceHistory.show(activityID)
			.success(function(data){
				data[0].activity.created_at = new Date(data[0].activity.created_at);
				data[0].first_letter = data[0].project.name.charAt(0);
				data[0].date_start = new Date(data[0].date_start);
				data[0].date_end = new Date(data[0].date_end);

				angular.forEach(data, function(item){
					angular.forEach(item.performances, function(performance){
						var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
						performance.experience = filter[0].experience;
						performance.date_start = new Date(performance.date_start);
						performance.date_end = new Date(performance.date_end);
					});
				})
				
				$scope.history = data;
			})

	}]);
sharedModule
	.controller('reportDialogController', ['$scope', '$filter', '$mdDialog', 'Preloader', 'Report', function($scope, $filter, $mdDialog, Preloader, Report){
		var reportID = Preloader.get();

		$scope.cancel = function(){
			$mdDialog.cancel();
		}

		Report.show(reportID)
			.success(function(data){
				data.date_start = new Date(data.date_start);
				data.date_end = new Date(data.date_end);

				angular.forEach(data.performances, function(performance){
					var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
					performance.experience = filter[0].experience;
					performance.date_start = new Date(performance.date_start);
					performance.date_end = new Date(performance.date_end);
				});
				
				$scope.report = data;
			})

	}]);
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
sharedModule
	.factory('Activity', ['$http', function($http){
		var urlBase = '/activity';
		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			reportSubmitted: function(data){
				return $http.post(urlBase + '-report-submitted', data);
			},
			reportUpdated: function(data){
				return $http.post(urlBase + '-report-updated', data);
			},
			reportDeleted: function(data){
				return $http.post(urlBase + '-report-deleted', data);
			},
		}
	}])
sharedModule
	.factory('Approval', ['$http', function($http){
		var urlBase = 'approval';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			performanceEdit: function(id, data){
				return $http.post(urlBase + '-performance-edit/' + id, data);
			},
			pending: function(data){
				return $http.post(urlBase + '-pending', data);
			},
			pendingUser: function(data){
				return $http.post(urlBase + '-pending-user', data);
			},
			details: function(id){
				return $http.get(urlBase + '-details/' + id);
			},
			approve: function(data){
				return $http.post(urlBase + '-approve', data);
			},
			decline: function(data){
				return $http.post(urlBase + '-decline', data);
			},
			reportDelete: function(id){
				return $http.post(urlBase + '-report-delete/' + id);
			},
			approveDelete: function(data){
				return $http.post(urlBase + '-approve-delete', data);
			},
			declineDelete: function(data){
				return $http.post(urlBase + '-decline-delete', data);
			},
		}
	}])
sharedModule
	.factory('Department', ['$http', function($http){
		var urlBase = '/department';
		return {
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
		}
	}])
sharedModule
	.factory('Experience', ['$http', function($http){
		var urlBase = '/experience';
		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			members: function(id){
				return $http.get(urlBase + '-members/' + id);
			},
			relation: function(projectID, memberID){
				return $http.get(urlBase + '-relation/' + projectID + '/member/' + memberID);
			}
		}
	}])
sharedModule
	.factory('Member', ['$http', function($http){
		var urlBase = 'member';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			teamLeader: function(id){
				return $http.get(urlBase + '-team-leader/' + id);
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			updateTenure: function(){
				return $http.put(urlBase + '-update-tenure');
			},
			department: function(id){
				return $http.get(urlBase +'-department/' + id);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
			project: function(id){
				return $http.get(urlBase + '-project/' + id);
			},
		}
	}])
sharedModule
	.factory('Notification', ['$http', function($http){
		var urlBase = 'notification';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			unseen: function(){
				return $http.get(urlBase + '-unseen');
			},
			seen: function(id){
				return $http.put(urlBase + '-seen/' + id);
			},
		}
	}])
sharedModule
	.factory('PerformanceApproval', ['$http', function($http){
		var urlBase = 'performance-approval';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			approved: function(data){
				return $http.post(urlBase + '-approved', data);
			},
			declined: function(data){
				return $http.post(urlBase + '-declined', data);
			},
			approvedUser: function(data){
				return $http.post(urlBase + '-approved-user', data);
			},
			declinedUser: function(id, data){
				return $http.post(urlBase + '-declined-user', data);
			},
			declinedDetails: function(id){
				return $http.get(urlBase +'-declined-details/' + id);
			},
			approvedDetails: function(id){
				return $http.get(urlBase +'-approved-details/' + id);
			},
		}
	}])
sharedModule
	.factory('PerformanceHistory', ['$http', function($http){
		var urlBase = '/performance-history';
		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}])
sharedModule
	.factory('Performance', ['$http', function($http){
		var urlBase = 'performance';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			checkLimit: function(id, data){
				return $http.post(urlBase + '-check-limit/' + id, data);
			},
			report: function(id){
				return $http.get(urlBase + '-report/' + id);
			},
			checkLimitEdit: function(id, data){
				return $http.post(urlBase + '-check-limit-edit/' + id, data);
			},
			topPerformers: function(id){
				return $http.get(urlBase + '-top-performers/' + id);
			},
			monthly: function(data){
				return $http.post(urlBase + '-monthly', data);
			},
			getMondays: function(data){
				return $http.post(urlBase + '-get-mondays', data);
			},
			getWeekends: function(data){
				return $http.post(urlBase + '-get-weekends', data);
			},
			weekly: function(data){
				return $http.post(urlBase + '-weekly', data);
			},
			evaluation: function(date_start, date_end, daily_work_hours, department, project, position, member){
				return $http.get(urlBase + '-evaluation/' + date_start + '/date_end/' + date_end + '/daily-work-hours/' + daily_work_hours + '/department/' + department + '/project/' + project + '/position/' + position + '/member/' + member + '/download/0')
			},
			evaluationMultiple: function(date_start, date_end, daily_work_hours, department, position, member){
				return $http.get(urlBase + '-evaluation-multiple/' + date_start + '/date_end/' + date_end + '/daily-work-hours/' + daily_work_hours + '/department/' + department + '/position/' + position + '/member/' + member + '/download/0')
			},
			checkLimitAll: function(data){
				return $http.post(urlBase + '-check-limit-all', data);
			},
			checkLimitEditAll: function(data){
				return $http.post(urlBase + '-check-limit-edit-all', data);
			},
		}
	}])
sharedModule
	.factory('Position', ['$http', function($http){
		var urlBase = 'position';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			project: function(id){
				return $http.get(urlBase + '-project/' + id);
			},
			department: function(id){
				return $http.get(urlBase + '-department/' + id);
			},
			unique: function(id){
				return $http.get(urlBase + '-unique/' + id);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
		}
	}])
sharedModule
	.factory('Programme', ['$http', function($http){
		var urlBase = '/programme';
		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}])
sharedModule
	.factory('Project', ['$http', function($http){
		var urlBase = 'project';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			department: function(id){
				return $http.get(urlBase + '-department/' + id);
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
		}
	}])
sharedModule
	.factory('Report', ['$http', function($http){
		var urlBase = 'report';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			paginate: function(page){
				return $http.get(urlBase + '-paginate?page=' + page);
			},
			paginateDetails: function(page){
				return $http.get(urlBase + '-paginate-details?page=' + page);
			},
			paginateDepartment: function(id, page){
				return $http.get(urlBase + '-paginate/' + id + '?page=' + page);
			},
			paginateDepartmentDetails: function(id, page){
				return $http.get(urlBase + '-paginate-details/' + id + '?page=' + page);
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			searchDepartment: function(id, data){
				return $http.post(urlBase + '-search-department/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			monthly: function(){
				return $http.get(urlBase + '-monthly');
			},
			searchMonthly: function(data){
				return $http.post(urlBase + '-search-monthly', data);
			},
			departmentMonthly: function(data){
				return $http.post(urlBase + '-department-monthly', data);
			},
			departmentMonthlyPosition: function(data){
				return $http.post(urlBase + '-department-monthly-position', data);
			},
		}
	}])
sharedModule
	.factory('Result', ['$http', function($http){
		var urlBase = 'result';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}])
sharedModule
	.factory('Target', ['$http', function($http){
		var urlBase = 'target';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			position: function(id){
				return $http.get(urlBase + '-position/' + id);
			},
			department: function(id){
				return $http.get(urlBase + '-department/' + id);
			},
			productivity : function(id){
				return $http.get(urlBase + '-productivity/' + id);
			},
			quality : function(id){
				return $http.get(urlBase + '-quality/' + id);
			},
			project: function(id){
				return $http.get(urlBase + '-project/' + id);
			},
		}
	}])
sharedModule
	.factory('User', ['$http', function($http){
		var urlBase = '/user';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
			teamLeader: function(){
				return $http.get(urlBase + '-team-leader');
			},
			checkPassword: function(data){
				return $http.post(urlBase + '-check-password', data)
			},
			changePassword: function(data){
				return $http.post(urlBase + '-change-password', data)
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			checkEmail: function(data){
				return $http.post(urlBase + '-check-email', data);
			},
			department: function(id){
				return $http.get(urlBase + '-department/' + id);
			},
		};
	}])
sharedModule
	.factory('WalkThrough', ['$http', function($http){
		var urlBase = '/walk-through';

		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return $http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		};
	}])
//# sourceMappingURL=shared.js.map
