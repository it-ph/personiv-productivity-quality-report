sharedModule
	.factory('Position', ['$http', function($http){
		var urlBase = 'position';

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
			project: function(id){
				return $http.get(urlBase + '-project/' + id);
			},
			department: function(id){
				return $http.get(urlBase + '-department/' + id);
			},
			unique: function(){
				return $http.get(urlBase + '-unique/');
			},
		}
	}])