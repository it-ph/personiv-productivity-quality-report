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
			pending: function(page){
				return $http.get(urlBase + '-pending?page=' + page);
			},
			approved: function(page){
				return $http.get(urlBase + '-approved?page=' + page);
			},
			declined: function(page){
				return $http.get(urlBase + '-declined?page=' + page);
			},
			details: function(id){
				return $http.get(urlBase + '-details/' + id);
			},
			approve: function(data){
				return $http.post(urlBase + '-approve', data);
			},
			decline: function(data){
				return $http.post(urlBase + '-decline', data);
			},
		}
	}])