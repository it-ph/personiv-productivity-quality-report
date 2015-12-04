var sharedModule = angular.module('sharedModule', [
	/* Vendor Dependencies */
	'ui.router',
	'ngMaterial',
	'ngMessages',
	'infinite-scroll',
], function($interpolateProvider){
	$interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});
sharedModule
	.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function($urlRouterProvider, $stateProvider, $mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('deep-purple')
			.accentPalette('pink');
		
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
	.factory('Department', ['$http', function($http){
		var urlBase = '/department';
		return {
			index: function(){
				return $http.get(urlBase);
			},
			show: function(id){
				return $http.get(urlBase + '/' + id);
			},
			store: function(data){
				return http.post(urlBase, data);
			},
			update: function(id, data){
				return $http.put(urlBase + '/' + id, data);
			},
			delete: function(id){
				return $http.delete(urlBase + '/' + id);
			},
		}
	}])
//# sourceMappingURL=shared.js.map
