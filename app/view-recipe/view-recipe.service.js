var ViewRecipeService = angular.module('ViewRecipeService', [])
.service('ViewRecipeService', ['ApiService', function(ApiService) {
	function getRecipe(recipeId) {
		return ApiService.get("recipes/" + recipeId);
	}

	return {
		getRecipe: getRecipe
	}

}]);