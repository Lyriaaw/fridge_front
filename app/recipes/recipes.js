'use strict';

angular.module('myApp.recipes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/recipes/add', {
    templateUrl: 'recipes/recipes.html',
    controller: 'RecipesCtrl'
  });
}])
.service('RecipeService', ['ApiService', '$timeout', function(ApiService, $timeout) {


  // Todo : Implement this function in APIService or create a ProductService
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

    const items = recipe.items;
    const steps = recipe.steps;

    console.log(recipe);




    return ApiService.post("recipes", recipeBase).then(
      function(response) {
        console.log(response);
        return response;
      },
      function(error) {
        console.warn("Error while posting recipe")
      }
    )


    /*
    ApiService.post("receipes", recipeBase).then(
      function(response) {
        const recipe_id = response.data.id;
        if (!recipe_id) {console.warn("No Id returned, this is a problem");}

        console.log("Recipe saved ...");

        // This is dirty .... when i'll found how to cascade save entities with ruby this part will be refactored
        var delay = 0;
        items.forEach(function(item){
          $timeout(function() {
            const saveItem = {
              receipe_id: recipe_id,
              product_id: item.product,
              quantity: item.quantity
            };

            ApiService.post("recipe/" + recipe_id + "/add-item", saveItem).then(
              function(success) {
                console.log("Saved item");
                console.log(success.data);
              },
              function(error) {
                console.warn(error);
              }
            );
            delay += 100;
          }, delay);
        });

        steps.forEach(function(step){
          $timeout(function() {
            step.receipe_id = recipe_id;

            ApiService.post("recipe/" + recipe_id + "/add-step", step).then(
              function(success) {
                console.log(success.data);
              },
              function(error) {
                console.warn(error);
              }
            );

            delay += 100;
          }, delay);
        });
        // I'm not proud ..



      },
      function(error) {
        console.warn(error);
      }
    )*/
  }



  return {
    getProducts: getCurrentProducts,
		saveRecipe: saveRecipe
  }

}])
.controller('RecipesCtrl', ['$scope', 'RecipeService', '$timeout', '$location', 'DataService', function($scope, RecipeService, $timeout, $location, DataService) {
  $scope.loading = true;
  $scope.products = [];

	$scope.headerUrl = "header.html";



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
    console.log("Canceling recipe");
    newRecipe();
  }

  function saveRecipe() {
    RecipeService.saveRecipe($scope.newRecipe).then(
      function(response) {
        // console.log("Received response : ");
        // console.log(response);
        $location.path("recipe/" + response.data.id + "/" + $scope.fr)
      }
    )
  }

  function addItem() {
    $scope.newRecipe.recipes_items.push(
      {product: {}, quantity: ''}
    )
  }

  function addStep() {
		$scope.newRecipe.recipes_steps.push(
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