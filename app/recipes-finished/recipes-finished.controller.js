'use strict';

angular.module('myApp.recipe-finished', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe/finished/:id', {
    templateUrl: 'recipes-finished/recipes-finished.html',
    controller: 'RecipeFinishedCtrl'
  });
}])

.controller('RecipeFinishedCtrl', ['$scope', 'RecipeFinishedService', '$timeout', '$location', 'RecipeAdviserService', 'ApiService', function($scope, RecipeFinishedService, $timeout, $location, RecipeAdviserService, ApiService) {

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


	/**
	 * Calculate proportions and save it into the database.
	 *
	 * @type {calculateProportions}
	 */
	$scope.calculateProportions = calculateProportions;
	function calculateProportions() {

		var fridge_content = RecipeAdviserService.getFridgeContent();

		var changed_items = [];


		$scope.proportions.forEach(function(proportion) {
			fridge_content.forEach(function(item) {
				if (proportion.product.id === item.product.id) {
					item.quantity -= proportion.real_quantity;
					changed_items.push(item);
				}
			});
		});

		var new_changed_item = {
			items: changed_items
		};

		ApiService.put("items", new_changed_item).then(
			function(success) {
				console.log(success);
			},
			function(error) {
				console.warn(error);

			}
		)

	}


}]);