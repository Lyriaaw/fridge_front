'use strict';

angular.module('myApp.recipes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes', {
    templateUrl: 'recipes/recipes.html',
    controller: 'RecipesCtrl'
  });
}])
.service('RecipeService', ['ApiService', function(ApiService) {


  // Todo : Implement this function in APIService or create a ProductService
  function getCurrentProducts() {
    return ApiService.get("products");
  }



  function saveRecipe(recipe) {
    console.log("Saving " + recipe.name);

    const recipeBase = {
      name: recipe.name,
      description: recipe.description
    };

    const items = recipe.items;
    const steps = recipe.steps;

    ApiService.post("receipes", recipeBase).then(
      function(response) {
        const recipe_id = response.data.id;
        if (!recipe_id) {console.warn("No Id returned, this is a problem");}

        console.log("Recipe saved ...");

        items.forEach(function(item){
          const saveItem = {
            receipe_id: recipe_id,
            product_id: item.product
          };

          ApiService.post("recipe/" + recipe_id + "/add-item", saveItem).then(
            function(success) {
              console.log("Saved item");
              console.log(success.data);
            },
            function(error) {
              console.warn(error);
            }
          )
        });

        steps.forEach(function(step){
					step.receipe_id = recipe_id;

          ApiService.post("recipe/" + recipe_id + "/add-step", step).then(
            function(success) {
              console.log(success.data);
            },
            function(error) {
              console.warn(error);
            }
          )
        });



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

}])
.controller('RecipesCtrl', ['$scope', 'RecipeService', '$timeout', function($scope, RecipeService, $timeout) {
  $scope.loading = true;
  $scope.products = [];



  function newRecipe() {
		$scope.newRecipe = {
			name: '',
			description: '',
			persons: 4,
			items: [
        {product: {}, quantity: ''}
      ],
			steps: [
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
    console.log("Canceling recipe");
    newRecipe();
  }

  function saveRecipe() {
    RecipeService.saveRecipe($scope.newRecipe);
  }

  function addItem() {
    $scope.newRecipe.items.push(
      {product: {}, quantity: ''}
    )
  }

  function addStep() {
		$scope.newRecipe.steps.push(
			{description: ''}
    )
  }




  function loadProducts() {
    RecipeService.getProducts().then(
      function(response) {
        $scope.products = response.data;
        console.log($scope.products);
        newRecipe();

        $timeout(function() {
          $scope.loading = false;

        }, 100);
      },
      function(error) {

      }
    );
  }
  loadProducts();










}]);