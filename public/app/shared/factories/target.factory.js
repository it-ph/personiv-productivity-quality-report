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
		}
	}])