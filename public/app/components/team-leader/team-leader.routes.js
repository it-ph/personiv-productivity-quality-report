teamLeaderModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url:'/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'toolbar@main': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainMonthlyContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/components/team-leader/templates/content/main-monthly.content.template.html',
					},
					'right-sidenav@main': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-monthly-right.sidenav.html',
					}
				}
			})
			.state('main.weekly-report',{
				url:'weekly-report',
				views: {
					'content-container': {
						templateUrl: '/app/components/team-leader/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'toolbar@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.weekly-report': {
						templateUrl: '/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main.weekly-report': {
						templateUrl: '/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				},
			})
			.state('main.members', {
				url:'members',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'membersContentContainerController',
					},
					'toolbar@main.members': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.members':{
						templateUrl: '/app/components/team-leader/templates/content/members.content.template.html',
					},
				}
			})
			.state('main.create-member', {
				url:'member/create',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'createMemberContentContainerController',
					},
					'toolbar@main.create-member': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.create-member':{
						templateUrl: '/app/components/team-leader/templates/content/create-member-content.template.html',
					},
				}
			})
			.state('main.edit-member', {
				url:'member/{memberID}/edit',
				params: {memberID:null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'editMemberContentContainerController',
					},
					'toolbar@main.edit-member': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.edit-member':{
						templateUrl: '/app/components/team-leader/templates/content/create-member-content.template.html',
					},
				}
			})
			.state('main.report', {
				url:'report',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'reportContentContainerController',
					},
					'toolbar@main.report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.report':{
						templateUrl: '/app/components/team-leader/templates/content/report.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.edit-report',{
				url:'edit-report/{reportID}',
				params: {'reportID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'editReportContentContainerController',
					},
					'toolbar@main.edit-report': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.edit-report':{
						templateUrl: '/app/shared/templates/content/edit-report.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})
			.state('main.approvals',{
				url:'approvals',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/app/shared/templates/content/approval.content.template.html',
					},
				},
				onEnter: ['$state', 'User', function($state, User){
					User.index()
						.success(function(data){
							if(data.role == 'manager'){
								$state.go('page-not-found');
							}
						});
				}],
			})

	}]);