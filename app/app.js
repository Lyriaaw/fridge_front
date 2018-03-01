'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.index',
  'myApp.recipes',
  'myApp.view-recipe',
  'myApp.version',
	'myApp.recipe-finished',
	'RecipeFinishedService',
	'myApp.new-product',
	'NewProductService',
	'ApiService',
	'DataService',
	'RecipeAdviserService',
	'RecipesService',
	'MainService',
	'ViewRecipeService'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/fridge/1'});
}]);