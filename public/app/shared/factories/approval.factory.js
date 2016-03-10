sharedModule
	.factory('Approval', ['$http', function($http){
		var urlBase = 'approval';

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
			performanceEdit: function(id, data){
				return $http.post(urlBase + '-performance-edit/' + id, data);
			},
		}
	}])