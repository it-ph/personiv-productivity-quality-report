sharedModule
	.factory('Performance', ['$http', function($http){
		var urlBase = 'performance';

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
			checkLimit: function(id, data){
				return $http.post(urlBase + '-check-limit/' + id, data);
			},
			report: function(id){
				return $http.get(urlBase + '-report/' + id);
			},
			checkLimitEdit: function(id, data){
				return $http.post(urlBase + '-check-limit-edit/' + id, data);
			},
			topPerformers: function(id){
				return $http.get(urlBase + '-top-performers/' + id);
			},
			monthly: function(data){
				return $http.post(urlBase + '-monthly', data);
			},
			getMondays: function(data){
				return $http.post(urlBase + '-get-mondays', data);
			},
			getWeekends: function(data){
				return $http.post(urlBase + '-get-weekends', data);
			},
			weekly: function(data){
				return $http.post(urlBase + '-weekly', data);
			},
			evaluation: function(date_start, date_end, daily_work_hours, department, project, position, member){
				return $http.get(urlBase + '-evaluation/' + date_start + '/date_end/' + date_end + '/daily-work-hours/' + daily_work_hours + '/department/' + department + '/project/' + project + '/position/' + position + '/member/' + member + '/download/0')
			},
			evaluationMultiple: function(date_start, date_end, daily_work_hours, department, position, member){
				return $http.get(urlBase + '-evaluation-multiple/' + date_start + '/date_end/' + date_end + '/daily-work-hours/' + daily_work_hours + '/department/' + department + '/position/' + position + '/member/' + member + '/download/0')
			},
		}
	}])