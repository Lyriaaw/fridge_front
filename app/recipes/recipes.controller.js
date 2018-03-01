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
    RecipesService.saveRecipe($scope.newRecipe).then(
      function(response) {
        // console.log("Received response : ");
        console.log(response);
				RecipeAdviserService.pushLastRecipe(response);
        $location.path("recipe/" + response.data)
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
    RecipesService.getProducts().then(
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