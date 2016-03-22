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
			approved: function(page){
				return $http.get(urlBase + '-approved?page=' + page);
			},
			declined: function(page){
				return $http.get(urlBase + '-declined?page=' + page);
			},
			approvedUser: function(id, page){
				return $http.get(urlBase + '-approved-user/'+ id +'?page=' + page);
			},
			declinedUser: function(id, page){
				return $http.get(urlBase + '-declined-user/'+ id +'?page=' + page);
			},
			declinedDetails: function(id){
				return $http.get(urlBase +'-declined-details/' + id);
			},
			approvedDetails: function(id){
				return $http.get(urlBase +'-approved-details/' + id);
			},
		}
	}])