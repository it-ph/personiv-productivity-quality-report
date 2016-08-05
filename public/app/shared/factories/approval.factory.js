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
			pending: function(data){
				return $http.post(urlBase + '-pending', data);
			},
			pendingUser: function(data){
				return $http.post(urlBase + '-pending-user', data);
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
			reportDelete: function(id){
				return $http.post(urlBase + '-report-delete/' + id);
			},
			approveDelete: function(data){
				return $http.post(urlBase + '-approve-delete', data);
			},
			declineDelete: function(data){
				return $http.post(urlBase + '-decline-delete', data);
			},
		}
	}])