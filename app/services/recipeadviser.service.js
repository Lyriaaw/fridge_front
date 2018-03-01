var RecipeAdviserService = angular.module('RecipeAdviserService', [])
.service("RecipeAdviserService", ['ApiService', 'DataService', '$timeout', function(ApiService, DataService, $timeout) {

	var availableRecipes = [];
	var fridge_content = [];
	var fridge_id;
	var process_loading = true;
	var selected_recipes = [];
	var finished_recipe = {};


	/**
	 * Launching
	 */
	function findAvailableRecipes() {
		process_loading = true;
		waitForFridgeId(process);
	}
	/**
	 * Wait for the fridge_id to start the process
	 * @param callback
	 */
	function waitForFridgeId(callback) {

		fridge_id = DataService.getFridgeId();

		if (fridge_id === -1) {
			setTimeout(waitForFridgeId, 100, callback);
		} else {
			setTimeout(callback, 100);
		}
	}

	/**
	 * Handle the receipe and fridge fetch sequence
	 *
	 */
	function process() {
		fetchRecipes().then(
			function(response) {
				fetchFridgeContent().then(
					function(response) {
						calculateRecipeScore();
						process_loading = false;
					}
				);

			}
		)
	}
	function fetchRecipes() {
		return ApiService.get("recipes/find/" + fridge_id).then(
			function(response) {
				availableRecipes = response.data;
				return availableRecipes;
			},
			function(error) {
				console.warn(error);
			}
		);
	}
	function fetchFridgeContent() {
		return ApiService.get("items/fridge/" + fridge_id).then(
			function(response) {
				fridge_content = response.data;
				return fridge_content;
			},
			function(error) {
				console.warn(error);
			}
		)
	}
	function calculateRecipeScore() {
		// TODO : implement, now it just select 3 random recipes from the list
		selected_recipes = [];

		var temp_list = [];
		temp_list = availableRecipes;

		if (temp_list.length <= 5) {
			selected_recipes = availableRecipes;
			return;
		}

		for (it = 0; it < 5; it++) {
			var randomIndex = Math.floor(Math.random() * Math.floor(temp_list.length));

			selected_recipes.push(temp_list[randomIndex]);

			temp_list.splice(randomIndex, 1);
			console.log(temp_list);
		}
	}




	/*
	Getters and setters to interact with the service
	 */

	function finishRecipe(recipe) {
		finished_recipe = recipe;
	}

	function pushLastRecipe(recipe) {
		selected_recipes.push(recipe);
	}

	function getProcessLoading() {
		return process_loading;
	}

	function getSelectedRecipes() {
		return selected_recipes;
	}

	function getFridgeContent() {
		return fridge_content;
	}

	function getFinishedRecipe() {
		return finished_recipe;
	}

	function addItemToFridge(item) {
		fridge_content.push(item);
	}

	function deleteItemFromFridge($index) {
		fridge_content.splice($index, 1);
	}

	function deleteItemModelFromFridge(item) {
		var index = fridge_content.indexOf(item);
		fridge_content.splice(index, 1);
	}

	return {
		findAvailableRecipes: findAvailableRecipes,
		getProcessLoading: getProcessLoading,
		getSelectedRecipes: getSelectedRecipes,
		getFridgeContent: getFridgeContent,
		finishRecipe: finishRecipe,
		getFinishedRecipe: getFinishedRecipe,
		pushLastRecipe: pushLastRecipe,
		process: process,
		addItemToFridge: addItemToFridge,
		deleteItemModelFromFridge: deleteItemModelFromFridge

	};

}]);