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