'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fridge/:id', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'MainService', '$timeout', '$routeParams', 'DataService', 'RecipeAdviserService', 'ApiService', function($scope, MainService, $timeout, $routeParams, DataService, RecipeAdviserService, ApiService) {

  $scope.loading = true;
  $scope.obsolete_loading = true;
  $scope.obsolete_items = [];



  $scope.recipes = {
  	loading: true,
  	list: []
	};


  // Launch the recipe adviser and wait for result

  function loadRecipes() {
  	console.log("loading recipes");
  	$timeout(function() {
  		$scope.recipes.loading = true;
		}, 100);


		RecipeAdviserService.findAvailableRecipes();

		waitForRecipes(placeContent)
	}

  function waitForRecipes(callback) { // Wait for the recipe adviser to be reader
  	if (RecipeAdviserService.getProcessLoading() === true) {
  		setTimeout(waitForRecipes, 100, callback);
		} else {
  		setTimeout(callback, 100);
		}

	}

	function placeContent() { // Save the recipes and render it
  	$scope.loading = true;
  	$scope.recipes.loading = true;

		$timeout(function() {
			$scope.recipes.list = RecipeAdviserService.getSelectedRecipes();
			$scope.items = RecipeAdviserService.getFridgeContent();

			$scope.recipes.loading = false;
			$scope.loading = false;
		}, 50);
	}

	loadContent();
  loadRecipes(); // TODO : Wait for loadContent() before launching loadRecipes()

  function loadContent() {
		DataService.saveFridgeId($routeParams.id);
  }



  // Pages animations

	$scope.addItem = {
    addingProduct: false,
    newItem: {},
    currentProducts: [],
    selectedProduct: {},
    waitingForProduct: true,
    productAmount: 0,
		limit_date: new Date()
  };

	$scope.cancelItemAdding = cancelItemAdding;
	function cancelItemAdding() { // Hide the "Add item" card
		$timeout(function(){
			$scope.addItem.addingProduct = false;
			$scope.addItem.waitingForProduct = true;
		}, 100);
	}

	$scope.prepareItemAdding = prepareItemAdding;
	function prepareItemAdding() {  // Fetch datas and display the "Add item" card

	  MainService.getCurrentProducts()
      .then(function(response) {

        $scope.addItem.currentProducts = response.data;

        $timeout(function() {
				  $scope.addItem.addingProduct = true;
        }, 100);

      }, function(error) {
        console.warn(error);

      });
  }

  $scope.selectProduct = selectProduct;
	function selectProduct(product) {  // Select a product in the product list and ask for the quantity

	  $scope.addItem.selectedProduct = product;



	  $timeout(function() {
	    $scope.addItem.waitingForProduct = false;
    }, 100);
  }


	$scope.saveItem = saveItem;
	/**
	 * Create an item, save it in the database and launch a new recipe research
	 */
  function saveItem() {
    MainService.saveItem($scope.addItem.productAmount, '2018-03-01', $scope.addItem.selectedProduct, $scope.fridge_id)
      .then(function(success){
				RecipeAdviserService.addItemToFridge(success.data);

        $timeout(function() {
					loadRecipes();

					$scope.addItem.productAmount = '';	// Resetting form for the next item
					$scope.addItem.addingProduct = false;
					$scope.addItem.selectedProduct = {};
					$scope.addItem.waitingForProduct = true;
				}, 100);

      }, function(error) {
        console.warn(error);
      });
  }

  $scope.deleteItem = deleteItem;

	/**
	 * Delete and item from the database and launch a new recipe research
	 * @param item
	 * @param index
	 */
  function deleteItem(item, index) {

  	ApiService.delete("items/" + item.id).then(
  		function(response) {
				loadRecipes();

				$timeout(function() {
					$scope.recipes.loading = true;
				}, 100)

			},
			function(error) {
  			console.warn(error);

			}
		);
	}


}]);