'use strict';

angular.module('myApp.recipe-finished', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe/finished/:id', {
    templateUrl: 'recipes-finished/recipes-finished.html',
    controller: 'RecipeFinishedCtrl'
  });
}])

.controller('RecipeFinishedCtrl', ['$scope', 'RecipeFinishedService', '$timeout', '$location', 'RecipeAdviserService', function($scope, RecipeFinishedService, $timeout, $location, RecipeAdviserService) {

  $scope.loading = true;

	$scope.headerUrl = "header.html";

	$scope.recipe = {};

	$scope.proportions = [];

	loadContent();
	function loadContent() {
		$scope.recipe = RecipeAdviserService.getFinishedRecipe();

		$scope.recipe.recipes_items.forEach(function(item) {
			$scope.proportions.push({
				product: item.product,
				initial_quantity: item.quantity,
				real_quantity: item.quantity
			})
		});


		$timeout(function() {
			$scope.loading = false;
		}, 50);
	}


}]);