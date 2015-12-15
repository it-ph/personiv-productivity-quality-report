adminModule
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
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/components/admin/templates/sidenavs/main-left.sidenav.html',
						controller: 'leftSidenavController',
					},
					'content-container@main': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'mainContentContainerController',
					},
					'content@main': {
						templateUrl: '/app/components/admin/templates/content/main.content.template.html',
					},
				}
			})
			.state('main.department-settings', {
				url:'department-settings',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'departmentSettingsContentContainerController',
					},
					'toolbar@main.department-settings': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.department-settings':{
						templateUrl: '/app/components/admin/templates/content/settings.content.template.html',
					},
				},
			})
			.state('main.team-leaders', {
				url:'team-leaders',
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'teamLeaderContentContainerController',
					},
					'toolbar@main.team-leaders': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.team-leaders':{
						templateUrl: '/app/components/admin/templates/content/settings.content.template.html',
					},
				},
			})
			.state('main.departments', {
				url: 'departments/{departmentID}',
				params: {'departmentID':null},
				views: {
					'content-container': {
						templateUrl: '/app/components/admin/views/content-container.view.html',
						controller: 'departmentContentContainerController',
					},
					'toolbar@main.departments': {
						templateUrl: '/app/components/admin/templates/toolbar.template.html',
					},
					'content@main.departments':{
						templateUrl: '/app/components/admin/templates/content/main.content.template.html',
					},
				}
			})
	}]);