'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.index',
  'myApp.recipes',
  'myApp.view-recipe',
  'myApp.version',
	'ApiService',
	'DataService',
	'RecipesService',
	'MainService'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/fridge/1'});
}]);