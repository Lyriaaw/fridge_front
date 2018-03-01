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
    RecipeAdviserService.finishRecipe($scope.recipe);
		$location.path("recipe/finished/" + $scope.recipe.id)
  }

  function cancelRecipe() {
    $location.path("fridge/" + DataService.getFridgeId());
  }

  function loadRecipe() {
    const recipe_id = $routeParams.id;
    // $scope.fridge_id = $routeParams.fridgeId;

    console.log("Hello ?");

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
  loadRecipe();










}]);