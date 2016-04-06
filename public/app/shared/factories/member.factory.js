sharedModule
	.factory('Member', ['$http', function($http){
		var urlBase = 'member';

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
			teamLeader: function(id){
				return $http.get(urlBase + '-team-leader/' + id);
			},
			search: function(data){
				return $http.post(urlBase + '-search', data);
			},
			updateTenure: function(id){
				return $http.put(urlBase + '-update-tenure/' + id);
			},
			department: function(id){
				return $http.get(urlBase +'-department/' + id);
			},
		}
	}])