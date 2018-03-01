'use strict';

angular.module('myApp.recipe-finished', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe/finished/:id', {
    templateUrl: 'recipes-finished/recipes-finished.html',
    controller: 'RecipeFinishedCtrl'
  });
}])

.controller('RecipeFinishedCtrl', ['$scope', 'RecipeFinishedService', '$timeout', '$location', 'RecipeAdviserService', 'ApiService', 'DataService', function($scope, RecipeFinishedService, $timeout, $location, RecipeAdviserService, ApiService, DataService) {

  $scope.loading = true;

	$scope.recipe = {};

	$scope.proportions = [];

	loadContent();
	function loadContent() {
		$scope.recipe = RecipeAdviserService.getFinishedRecipe();

		$scope.recipe.recipes_items.forEach(function(item) { // creating the real_proportions based on the product and the initial initial quantity
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

		/*
		Running throw all proportions and all items and testing id's equality :/
		 */
		$scope.proportions.forEach(function(proportion) {
			fridge_content.forEach(function(item) {

				if (proportion.product.id === item.product.id) {
					item.quantity -= proportion.real_quantity;
					changed_items.push(item);
				}

			});
		});

		separateFinishedAndUpdatedItems(changed_items);

	}

	/**
	 * Separate the items after the quantity remove
	 * @param items
	 */
	function separateFinishedAndUpdatedItems(items) {

		var finished = [];
		var to_update = [];

		items.forEach(function(item) {
			if (item.quantity <= 0) {
				finished.push(item);
			} else {
				to_update.push(item);
			}
		});

		updateItems(to_update);
		deleteItems(finished);
	}

	function updateItems(to_update) { // Update the items where the quantity is more than 0
		var new_changed_item = {
			items: to_update
		};

		ApiService.put("items", new_changed_item).then(
			function(success) {
				console.log(success);
				$location.path("fridge/" + DataService.getFridgeId());
			},
			function(error) {
				console.warn(error);
			}
		);
	}

	function deleteItems(finished) { // delete the items that are finished
		finished.forEach(function(item) {
			ApiService.delete("items/" + item.id).then(
				function(response) {

					RecipeAdviserService.deleteItemModelFromFridge(item);
				},
				function(error) {
					console.warn(error);
				}
			)
		});
	}

}]);