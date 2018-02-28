'use strict';

angular.module('myApp.view-recipe', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipe/:id', {
    templateUrl: 'view-recipe/view-recipe.html',
    controller: 'ViewRecipeCtrl'
  });
}])
.service('ViewRecipeService', ['ApiService', '$timeout', function(ApiService, $timeout) {


  // Todo : Implement this function in APIService or create a ProductService
  function getRecipe(recipeId) {
    return ApiService.get("receipes/" + recipeId);
  }


  return {
		getRecipe: getRecipe
  }

}])
.controller('ViewRecipeCtrl', ['$scope', 'ViewRecipeService', '$timeout', '$routeParams', function($scope, ViewRecipeService, $timeout, $routeParams) {
  $scope.loading = true;
  $scope.recipe = {};

  function loadRecipe() {
    const recipe_id = $routeParams.id;

    console.log("Hello ?");

    ViewRecipeService.getRecipe(recipe_id).then(
      function(response) {
        $scope.recipe = response.data;
        console.log($scope.recipe.receipe_steps[0].description);

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