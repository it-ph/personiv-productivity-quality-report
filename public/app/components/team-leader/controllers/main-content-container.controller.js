teamLeaderModule
	.controller('mainContentContainerController', ['$scope', '$filter', '$state', '$mdToast', '$mdDialog', 'Approval', 'Preloader', 'Member', 'Position', 'Report', 'Performance', 'Target', 'User', 'WalkThrough', 'Project', function($scope, $filter, $state, $mdToast, $mdDialog, Approval, Preloader, Member, Position, Report, Performance, Target, User, WalkThrough, Project){
		// var user = null;
		// $scope.tour = {};
		// $scope.tour.search = 'Need to find something? I\'ll help you find what you\'re looking for.';
		// $scope.tour.notification = 'You don\'t have to wait for the confirmation of your request. I\'ll notify you when something needs your attention.';
		// $scope.tour.refresh = 'Refreshes the current displayed data.'
		// $scope.subheaderTour = function(){
		// 	$scope.subheaderTour = 0;
		// }
		// $scope.stopTours = function(){
		// 	WalkThrough.show(user.id)
		// 		.success(function(data){
		// 			if(!data){			
		// 				WalkThrough.store(user)
		// 					.error(function(){
		// 						Preloader.error();
		// 					});
		// 			}
		// 		})
		// }

		$scope.filterDate = {};
		$scope.filterData = {};
		$scope.filterDate.type = 'Weekly';

		$scope.rightSidenav = {};
		$scope.rightSidenav.show = true;
		$scope.rightSidenav.items = [];
		$scope.rightSidenav.queryMember = function(query){
			var results = query ? $filter('filter')($scope.rightSidenav.items, query) : $scope.rightSidenav.items;
			return results;
		}	

		$scope.months = [
			{'value': '01', 'month': 'January'},
			{'value': '02', 'month': 'February'},
			{'value': '03', 'month': 'March'},
			{'value': '04', 'month': 'April'},
			{'value': '05', 'month': 'May'},
			{'value': '06', 'month': 'June'},
			{'value': '07', 'month': 'July'},
			{'value': '08', 'month': 'August'},
			{'value': '09', 'month': 'September'},
			{'value': '10', 'month': 'October'},
			{'value': '11', 'month': 'November'},
			{'value': '12', 'month': 'December'},
		];

		$scope.months_array = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		$scope.years = [];
		
		var dateCreated = 2016;

		// will generate the dates that will be used in drop down menu
		for (var i = new Date().getFullYear(); i >= dateCreated; i--) {
			$scope.years.push(i);
		};

		$scope.filterDate.date_start_month = $scope.months_array[new Date().getMonth()];
		$scope.filterDate.date_start_year = $scope.years[0];
		
		$scope.getMondays = function(){
			$scope.filterDate.date_end = null;
			$scope.filterDate.date_start = null;
			$scope.filterDate.weekend = [];
			Performance.getMondays($scope.filterDate)
				.success(function(data){
					$scope.mondays = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getWeekends = function(){	
			$scope.filterDate.date_end = null;	
			$scope.filterDate.weekend = [];
			Performance.getWeekends($scope.filterDate)
				.success(function(data){
					$scope.weekends = data;
				})
				.error(function(){
					Preloader.error();
				});
		};

		$scope.getPositions = function(){
			Position.project($scope.projects[$scope.filterData.project].id)
				.success(function(data){
					$scope.positions = data;
				})
		}

		$scope.clearFilter = function(){
			$scope.positions = [];
			$scope.filterData.project = '';
			$scope.filterData.position = '';
			$scope.filterDate.date_start = '';
			$scope.filterDate.date_end = ''
		}
		
		/**
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		$scope.toolbar.childState = 'Weekly Report';
		$scope.toolbar.hideSearchIcon = true;
		/**
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.state = 'dashboard';

		/* Refreshes the list */
		$scope.subheader.refresh = function(){
			$scope.report.show = false;
			// start preloader
			Preloader.preload();
			$scope.init(true);

		};

		$scope.subheader.download = function(){
			$mdDialog.show({
		    	controller: 'downloadReportDialogController',
		      	templateUrl: '/app/components/team-leader/templates/dialogs/download-report-dialog.template.html',
		      	parent: angular.element(document.body),
		    });
		}
		
		$scope.searchUserInput = function(){
			$scope.report.show = false;
			Preloader.preload();
			Report.search($scope.filterDate)
				.success(function(data){
					$scope.report.results = data;
					angular.forEach(data, function(item){
						pushItem(item);
					});
					
					Preloader.stop();
				})
				.error(function(data){
					Preloader.error();
				});
		};

		// $scope.show = function(id){
		// 	$state.go('main.units', {'assetID': $stateParams.assetID, 'unitID':id});
		// };
		/**
		 * Object for content view
		 *
		*/
		$scope.fab = {};

		// $scope.fab.icon = 'mdi-plus';
		// $scope.fab.label = 'Add';
		
		$scope.fab.show = false;

		// $scope.fab.action = function(){
		// 	return;
		// };

		$scope.editReport = function(id){
			$state.go('main.edit-report', {'reportID':id});
		};

		$scope.deleteReport = function(id){
			var confirm = $mdDialog.confirm()
		        .title('Delete Report')
		        .content('Are you sure you want to delete this report?')
		        .ok('Delete')
		        .cancel('Cancel');
		    $mdDialog.show(confirm)
		    	.then(function() {
		    		Preloader.preload();
			    	Approval.reportDelete(id)
			    		.success(function(){
			    			Preloader.stop();
			    			$mdToast.show(
						    	$mdToast.simple()
							        .content('Request has been submitted for approval.')
							        .position('bottom right')
							        .hideDelay(3000)
						    );
			    		})
			    }, function() {
			    	return;
			    });
		}

		var pushItem = function(report){
			report.date_start = new Date(report.date_start);
			report.date_end = new Date(report.date_end);

			angular.forEach(report.performances, function(performance){
				var filter = $filter('filter')(performance.member.experiences, {project_id:performance.project_id});
				performance.experience = filter[0].experience;
			});

			// Targets
			report.project.beginner = [];
			report.project.moderately_experienced = [];
			report.project.experienced = [];
			report.project.quality = [];

			angular.forEach(report.project.positions, function(position){
				var targets = [];
				var index = 0;
				angular.forEach(position.targets, function(target){
					var target_created_at = new Date(target.created_at).setHours(0,0,0,0);
					if(!target.deleted_at && target_created_at <= new Date(report.date_start)){
						targets.splice(index, 0, target);
						index++;
					}
					else if(target.deleted_at && target_created_at < report.date_start){
						targets.splice(index, 0, target);
						index++;
					}
				});

				// console.log(targets);

				if(targets.length){
					var beginner_productivity = $filter('filter')(targets, {experience:'Beginner'}, true);
					var moderately_experienced_productivity = $filter('filter')(targets, {experience:'Moderately Experienced'}, true);
					var experienced_productivity = $filter('filter')(targets, {experience:'Experienced'}, true);
					var quality = $filter('filter')(targets, {experience:'Experienced'}, true);
				}
				else{
					var beginner_productivity = $filter('filter')(position.targets, {experience:'Beginner', deleted_at:null}, true);
					var moderately_experienced_productivity = $filter('filter')(position.targets, {experience:'Moderately Experienced', deleted_at:null}, true);
					var experienced_productivity = $filter('filter')(position.targets, {experience:'Experienced', deleted_at:null}, true);
					var quality = $filter('filter')(position.targets, {experience:'Experienced', deleted_at:null}, true);
				}

				report.project.beginner.push(beginner_productivity[0].productivity);
				report.project.moderately_experienced.push(moderately_experienced_productivity[0].productivity);
				report.project.experienced.push(experienced_productivity[0].productivity);
				report.project.quality.push(quality[0].quality);
			}) 

			// Charts
			report.chartType = 'bar';
			report.charts = {};
									
			report.charts.productivity = {};
			report.charts.productivity.data = [[]];
			report.charts.productivity.series = ['Productivity'];
			report.charts.productivity.labels = [];
			
			report.charts.quality = {};
			report.charts.quality.data = [[]];
			report.charts.quality.series = ['Quality'];
			report.charts.quality.labels = [];

			angular.forEach(report.performances, function(performance, key){
				report.charts.productivity.data[0].push(performance.productivity);
				report.charts.quality.data[0].push(performance.quality);
				report.charts.productivity.labels.push(performance.member.full_name);
				report.charts.quality.labels.push(performance.member.full_name);
			});

			return report;
		}

		$scope.init = function(refresh){
			Member.index()
			.success(function(data){
				angular.forEach(data, function(item){
					var member = {};
					member.full_name = item.full_name;
					$scope.rightSidenav.items.push(member);
				});
			})

			Position.index()
				.success(function(data){
					$scope.positions = data;
				});

			Project.index()
				.success(function(data){
					$scope.projects = data;
				});

			$scope.getMondays();
			/**
			 * Object for report
			 *
			*/
			$scope.report = {};
			$scope.report.paginated = [];
			// 2 is default so the next page to be loaded will be page 2 
			$scope.report.page = 2;

			Report.paginateDetails()
				.success(function(data){
					$scope.report.details = data;
					$scope.report.paginated = data.data;
					$scope.report.show = true;

					if(data.data.length){
						// iterate over each record and set the updated_at date and first letter
						angular.forEach(data.data, function(data){
							pushItem(data);
						});
					}

					// 	$scope.fab.show = true;
					// }

					$scope.report.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.report.busy || ($scope.report.page > $scope.report.details.last_page)){
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.report.busy = true;

						Report.paginateDetails($scope.report.page)
							.success(function(data){
								// increment to call the next page for the next call
								$scope.report.page++;
								// iterate over the paginated data and push it to the original array
								angular.forEach(data.data, function(data){
									pushItem(data);
									$scope.report.paginated.push(data);
								});
								// enables next call
								$scope.report.busy = false;
							})
							.error(function(){
								Preloader.error();
							});
				}
				if(refresh){
					Preloader.stop();
					Preloader.stop();
				}
			})
			.error(function(){
				Preloader.error();
			})
		}

		$scope.init();
	}]);