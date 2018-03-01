var ViewRecipeService = angular.module('ViewRecipeService', [])
.service('ViewRecipeService', ['ApiService', '$timeout', function(ApiService, $timeout) {

	function getRecipe(recipeId) {
		return ApiService.get("recipes/" + recipeId);
	}


	return {
		getRecipe: getRecipe
	}

}])