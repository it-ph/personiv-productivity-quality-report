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
			updateTenure: function(){
				return $http.put(urlBase + '-update-tenure');
			},
			department: function(){
				return $http.get(urlBase +'-department');
			},
			checkDuplicate: function(data){
				return $http.post(urlBase + '-check-duplicate', data);
			},
			project: function(id){
				return $http.get(urlBase + '-project/' + id);
			},
		}
	}])