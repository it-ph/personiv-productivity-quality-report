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
		}
	}])