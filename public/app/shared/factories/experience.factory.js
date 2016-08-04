sharedModule
	.factory('Experience', ['$http', function($http){
		var urlBase = '/experience';
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
			members: function(id){
				return $http.get(urlBase + '-members/' + id);
			},
			relation: function(projectID, memberID){
				return $http.get(urlBase + '-relation/' + projectID + '/member/' + memberID);
			}
		}
	}])