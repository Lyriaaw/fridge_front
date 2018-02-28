'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.service('MainService', ['ApiService', function(ApiService) {
  // TODO : Place Service in a different file
  // TODO : Take data control out of the controller and place it in the service
  var mainServiceInstance = {
    getContent: getFridgeContent,
		getCurrentProducts: getCurrentProducts,
		saveItem: saveItem
  };


  function getFridgeContent() {
    return ApiService.get("items");
  }

  function getCurrentProducts() {
    return ApiService.get("products");

  }


  function saveItem(amount, product) {
    console.log("Saving " + amount + " of " + product.name);

    const itemBody = {
      product_id: product.id,
      quantity: amount
    };

    return ApiService.post("items", itemBody);
  }





  return mainServiceInstance;
}])

.controller('MainCtrl', ['$scope', 'MainService', '$timeout', function($scope, MainService, $timeout) {

  $scope.loading = true;

  $scope.addItem = {
    addingProduct: false,
    newItem: {},
    currentProducts: [],
    selectedProduct: {},
    waitingForProduct: true,
    productAmount: 0
  };

  function loadContent() {

    MainService.getContent()
      .then(function(response) {
        $scope.items = response.data;

				$timeout(function() {
					$scope.loading = false;
				}, 100);

      }, function(error) {
        console.warn(error);
      });
  }

  loadContent();

  //

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

    MainService.saveItem($scope.addItem.productAmount, $scope.addItem.selectedProduct)
      .then(function(success){
        $scope.items.push(success.data);  // Let's avoid to reload the page and fetch again in the database

        $timeout(function() {
					$scope.addItem.addingProduct = false;
				}, 100);

      }, function(error) {
        console.warn(error);
      });
  }




}]);