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