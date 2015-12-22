sharedModule
	.factory('Report', ['$http', function($http){
		var urlBase = 'report';

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
			paginate: function(page){
				return $http.get(urlBase + '-paginate?page=' + page);
			},
			paginateDetails: function(page){
				return $http.get(urlBase + '-paginate-details?page=' + page);
			},
			paginateDepartment: function(id, page){
				return $http.get(urlBase + '-paginate/' + id + '?page=' + page);
			},
			paginateDepartmentDetails: function(id, page){
				return $http.get(urlBase + '-paginate-details/' + id + '?page=' + page);
			},
		}
	}])