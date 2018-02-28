'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.index',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}])
.service("ApiService", ['$http', function($http) {// TODO : Place Service in a different file
	var apiServiceInstance = {
	  call: call,
	  get: get,
	  post: post
  };

	var config = {
		url: 'http://127.0.0.1:3000/'
	};

	// Test with a callback, not convinced ...
	function call(url, callback){
		return $http({
			method: 'GET',
			url: config.url + url
		}).then(callback, function() {
			console.warn("Request to " + url + " failed");
		});
	}


	function get(url) {
		return $http({
			method: 'GET',
			url: config.url + url
		});
	}

	function post(url, body) {
		return $http.post(config.url + url, body);
	}


	// apiServiceInstance.call = call;

	return apiServiceInstance;
}]);