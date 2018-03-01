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

	function process() {
		console.log("Launching process");

		fetchRecipes().then(
			function(response) {
				console.log("Recipes fetched");

				fetchFridgeContent().then(
					function(response) {
						console.log("Fridge fetched");

						calculateRecipeScore();
						process_loading = false;

						console.log("Process finished")
					}
				);

			}
		)
	}
	function fetchRecipes() {
		return ApiService.get("recipes/find/" + DataService.getFridgeId()).then(
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
			}
		)
	}
	function calculateRecipeScore() {
		console.log("Calculating score : TODO");
		selected_recipes = availableRecipes.slice(0, 3);
	}





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

	return {
		findAvailableRecipes: findAvailableRecipes,
		getProcessLoading: getProcessLoading,
		getSelectedRecipes: getSelectedRecipes,
		getFridgeContent: getFridgeContent,
		finishRecipe: finishRecipe,
		getFinishedRecipe: getFinishedRecipe,
		pushLastRecipe: pushLastRecipe

	}

}]);