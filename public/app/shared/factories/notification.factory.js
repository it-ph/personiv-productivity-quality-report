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