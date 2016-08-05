sharedModule
	.factory('PerformanceApproval', ['$http', function($http){
		var urlBase = 'performance-approval';

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
			approved: function(data){
				return $http.post(urlBase + '-approved', data);
			},
			declined: function(data){
				return $http.post(urlBase + '-declined', data);
			},
			approvedUser: function(data){
				return $http.post(urlBase + '-approved-user', data);
			},
			declinedUser: function(id, data){
				return $http.post(urlBase + '-declined-user', data);
			},
			declinedDetails: function(id){
				return $http.get(urlBase +'-declined-details/' + id);
			},
			approvedDetails: function(id){
				return $http.get(urlBase +'-approved-details/' + id);
			},
		}
	}])