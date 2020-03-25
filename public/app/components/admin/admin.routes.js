adminModule
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url:'/',
				views: {
					'': {
						templateUrl: '/public-pqr/public/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'toolbar@main': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'content@main': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/main.content.template.html'
					},
					'right-sidenav@main': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/sidenavs/main-right.sidenav.html',
					},
				}
			})
			.state('main.activity',{
				url:'activities',
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/team-leader/views/content-container.view.html',
						controller: 'activityContentContainerController',
					},
					'toolbar@main.activity': {
						templateUrl: '/public-pqr/public/app/components/team-leader/templates/toolbar.template.html',
					},
					'content@main.activity': {
						templateUrl: '/public-pqr/public/app/shared/templates/content/activity.content.template.html',
					},
				},
			})
			.state('main.weekly-report', {
				url: 'weekly-report/{departmentID}',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'departmentContentContainerController',
					},
					'toolbar@main.weekly-report': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.weekly-report': {
						templateUrl: '/public-pqr/public/app/shared/templates/main.content.template.html',
					},
					'right-sidenav@main.weekly-report': {
						templateUrl: '/public-pqr/public/app/components/team-leader/templates/sidenavs/main-right.sidenav.html',
					}
				}
			})
			.state('main.work-hours', {
				url:'work-hours',
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'workHoursContentContainerController',
					},
					'toolbar@main.work-hours': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.work-hours':{
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/work-hours.content.template.html',
					},
				},
			})
			.state('main.team-leaders', {
				url:'team-leaders',
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'teamLeaderContentContainerController',
					},
					'toolbar@main.team-leaders': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.team-leaders':{
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/team-leaders.content.template.html',
					},
				},
			})
			.state('main.department-settings', {
				url:'department-settings',
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'departmentSettingsContentContainerController',
					},
					'toolbar@main.department-settings': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.department-settings':{
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/settings.content.template.html',
					},
				},
			})
			.state('main.projects',{
				url: 'department-settings/{departmentID}/projects',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'projectsContentContainerController',
					},
					'toolbar@main.projects': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.projects':{
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/projects.content.template.html',
					},
				}
			})
			.state('main.positions',{
				url: 'department-settings/{departmentID}/project/{projectID}',
				params: {'departmentID':null, 'projectID':null},
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'positionsContentContainerController',
					},
					'toolbar@main.positions': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.positions':{
						templateUrl: '/public-pqr/public/app/components/admin/templates/content/positions.content.template.html',
					},
				}
			})
			.state('main.edit-report',{
				url:'edit-report/{reportID}',
				params: {'reportID':null},
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'editReportContentContainerController',
					},
					'toolbar@main.edit-report': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.edit-report':{
						templateUrl: '/public-pqr/public/app/shared/templates/content/edit-report.content.template.html',
					},
				}
			})
			.state('main.approvals',{
				url:'approvals',
				views: {
					'content-container': {
						templateUrl: '/public-pqr/public/app/components/admin/views/content-container.view.html',
						controller: 'approvalsContentContainerController',
					},
					'toolbar@main.approvals': {
						templateUrl: '/public-pqr/public/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.approvals':{
						templateUrl: '/public-pqr/public/app/shared/templates/content/approval.content.template.html',
					},
				}
			})
	}]);