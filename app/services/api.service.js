var ApiService = angular.module('ApiService', [])
.service("ApiService", ['$http', function($http) {
	var apiServiceInstance = {
		get: get,
		post: post,
		put: put,
		delete: doDelete
	};

	var config = {
		url: 'http://127.0.0.1:3000/'
	};

	function get(url) {
		return $http({
			method: 'GET',
			url: config.url + url
		});
	}

	function post(url, body) {
		return $http.post(config.url + url, body);
	}

	function put(url, body) {
		return $http.put(config.url + url, body);
	}

	function doDelete(url) {
		return $http.delete(config.url + url);
	}

	return apiServiceInstance;
}]);