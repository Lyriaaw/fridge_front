var RecipesService = angular.module('RecipesService', [])
.service('RecipesService', ['ApiService', function(ApiService) {



	function getCurrentProducts() {
		return ApiService.get("products");
	}


	function saveRecipe(recipe) {
		console.log("Saving " + recipe.name);

		const recipeBase = {
			recipe :recipe,
			items :recipe.recipes_items,
			steps :recipe.recipes_steps
		};


		return ApiService.post("recipes", recipeBase).then(
			function(response) {
				console.log(response);
				return response;
			},
			function(error) {
				console.warn("Error while posting recipe")
			}
		)
	}



	return {
		getProducts: getCurrentProducts,
		saveRecipe: saveRecipe
	}

}])