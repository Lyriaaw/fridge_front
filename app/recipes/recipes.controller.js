'use strict';

angular.module('myApp.recipes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes/add', {
    templateUrl: 'recipes/recipes.html',
    controller: 'RecipesCtrl'
  });
}])

.controller('RecipesCtrl', ['$scope', 'RecipesService', '$timeout', '$location', 'DataService', 'RecipeAdviserService', function($scope, RecipesService, $timeout, $location, DataService, RecipeAdviserService) {
  $scope.loading = true;
  $scope.products = [];


  function newRecipe() {
		$scope.newRecipe = {
			name: '',
			description: '',
			persons: 4,
			recipes_items: [
        {product: {}, quantity: ''}
      ],
			recipes_steps: [
        {description: ''}
      ]
		};
  }

  $scope.functions = {
    cancelRecipe: cancelRecipe,
		saveRecipe: saveRecipe,
		addItem: addItem,
		addStep: addStep
  };


  function cancelRecipe() {
    newRecipe();
  }

  function saveRecipe() {
    RecipesService.saveRecipe($scope.newRecipe).then(
      function(response) {
				RecipeAdviserService.pushLastRecipe(response); 	// adding the recipe to the front_memory
				RecipeAdviserService.process();									// new recipe research with this new recipe

        $location.path("recipe/" + response.data.id)				// Moving to recipe page
      }
    )
  }

  function addItem() { // Add an item to the recipe form
    $scope.newRecipe.recipes_items.push(
      {product: {}, quantity: ''}
    )
  }

  function addStep() { // Add an step to the recipe form
		$scope.newRecipe.recipes_steps.push(
			{description: ''}
    )
  }



  loadProducts();
	/**
	 * Get the list of product for the selects
	 */
  function loadProducts() {
		newRecipe();
    RecipesService.getProducts().then(
      function(response) {
        $scope.products = response.data;

        $timeout(function() {
          $scope.loading = false;
        }, 100);
      },
      function(error) {
      	console.warn(error);
      }
    );
  }







}]);