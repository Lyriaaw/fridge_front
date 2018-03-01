var RecipesService = angular.module('RecipesService', [])
.service('RecipesService', ['ApiService', function(ApiService) {

	function getCurrentProducts() {
		return ApiService.get("products");
	}


	function saveRecipe(recipe) {

		const recipeBase = { // We currently need to format datas in order to make the back work .. // TODO
			recipe :recipe,
			items :recipe.recipes_items,
			steps :recipe.recipes_steps
		};

		return ApiService.post("recipes", recipeBase).then(
			function(response) {
				return response;
			},
			function(error) {
				console.warn(error);
			}
		)
	}



	return {
		getProducts: getCurrentProducts,
		saveRecipe: saveRecipe
	}

}]);