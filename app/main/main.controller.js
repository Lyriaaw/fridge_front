'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fridge/:id', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'MainService', '$timeout', '$routeParams', 'DataService', 'RecipeAdviserService', function($scope, MainService, $timeout, $routeParams, DataService, RecipeAdviserService) {

  $scope.loading = true;
  $scope.obsolete_loading = true;
  $scope.obsolete_items = [];
	$scope.headerUrl = "header.html";



  $scope.recipes = {
  	loading: true,
  	list: []
	};


  // Launch the recipe adviser and wait for result

  function loadRecipes() {
		RecipeAdviserService.findAvailableRecipes();

		waitForRecipes(placeContent)
	}

  function waitForRecipes(callback) {
  	if (RecipeAdviserService.getProcessLoading() === true) {
  		setTimeout(waitForRecipes, 100, callback);
		} else {
  		setTimeout(callback, 50);
		}

	}

	function placeContent() {
		$scope.recipes.list = RecipeAdviserService.getSelectedRecipes();
		$scope.items = RecipeAdviserService.getFridgeContent();

		$timeout(function() {
			$scope.recipes.loading = false;
			$scope.loading = false;
		}, 50);
	}

	loadContent();
  loadRecipes(); // TODO : Wait for laodContent() before launching loadRecipes()

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
  function saveItem() {

    MainService.saveItem($scope.addItem.productAmount, $scope.addItem.limit_date, $scope.addItem.selectedProduct, $scope.fridge_id)
      .then(function(success){
        $scope.items.push(success.data);  // Let's avoid to reload the page and fetch again in the database

        $timeout(function() {
					$scope.addItem.addingProduct = false;
					$scope.addItem.selectedProduct = {};
					// $scope.recipes.loading = true;
					loadRecipes();

				}, 100);

      }, function(error) {
        console.warn(error);
      });
  }




}]);