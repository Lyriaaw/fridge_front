'use strict';

angular.module('myApp.view-recipe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe/:id', {
    templateUrl: 'view-recipe/view-recipe.html',
    controller: 'ViewRecipeCtrl'
  });
}])
.controller('ViewRecipeCtrl', ['$scope', 'ViewRecipeService', '$timeout', '$routeParams', 'RecipeAdviserService', '$location', 'DataService', function($scope, ViewRecipeService, $timeout, $routeParams, RecipeAdviserService, $location, DataService) {
  $scope.loading = true;
  $scope.recipe = {};

  $scope.headerUrl = "header.html";

  $scope.functions = {
		finished: finished,
		cancelRecipe: cancelRecipe
  };

  function finished() {
    RecipeAdviserService.finishRecipe($scope.recipe); // Save the recipe in the recipe advisor.
		$location.path("recipe/finished/" + $scope.recipe.id) // Go to the proportion management page
  }

  function cancelRecipe() { // Go back to the dashboard
    $location.path("fridge/" + DataService.getFridgeId());
  }


  loadRecipe();
	/**
   * Load the current recipe from the database
	 */
	function loadRecipe() {
    const recipe_id = $routeParams.id;

    ViewRecipeService.getRecipe(recipe_id).then(
      function(response) {
        $scope.recipe = response.data;

        $timeout(function() {
          $scope.loading = false;
        }, 100);

      },
      function(error) {
        console.warn(error);
      }
    )
  }










}]);