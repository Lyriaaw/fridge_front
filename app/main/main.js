'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fridge/:id', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.service('MainService', ['ApiService', function(ApiService) {
  // TODO : Place Service in a different file
  // TODO : Take data control out of the controller and place it in the service
  var mainServiceInstance = {
    getContent: getFridgeContent,
		getSoonObsoleteItems: getSoonObsoleteItems,
		getCurrentProducts: getCurrentProducts,
		saveItem: saveItem,
		findAvailableRecipes: findAvailableRecipes
  };



  function getFridgeContent(fridge_id) {
    return ApiService.get("items/fridge/" + fridge_id);
  }
  function getSoonObsoleteItems(fridge_id) {
    return ApiService.get("items/fridge/" + fridge_id + "/obsolete");
  }


  function getCurrentProducts() {
    return ApiService.get("products");
  }

  function findAvailableRecipes(fridge_id) {
  	return ApiService.get("/recipes/find/" + fridge_id);
	}


  function saveItem(amount, limit_date, product, fridge_id) {

    const itemBody = {
      product_id: product.id,
      fridge_id: fridge_id,
      quantity: amount,
			limit_date: formatDate(limit_date)
    };

    return ApiService.post("items", itemBody);
  }


	function formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}





  return mainServiceInstance;
}])

.controller('MainCtrl', ['$scope', 'MainService', '$timeout', '$routeParams', 'DataService', function($scope, MainService, $timeout, $routeParams, DataService) {

  $scope.loading = true;
  $scope.obsolete_loading = true;
  $scope.obsolete_items = [];
	$scope.headerUrl = "header.html";





	$scope.addItem = {
    addingProduct: false,
    newItem: {},
    currentProducts: [],
    selectedProduct: {},
    waitingForProduct: true,
    productAmount: 0,
		limit_date: new Date()
  };


  $scope.recipes = {
  	loading: true,
  	list: []
	};

  function loadRecipes() {
		// $scope.fridge_id = $routeParams.id;
  	MainService.findAvailableRecipes($scope.fridge_id).then(
  		function(response) {
  			$scope.recipes.list = response.data;

  			$timeout(function() {
  				$scope.recipes.loading = false;
				}, 100);
			},
			function(error) {

			}
		)
	}
	loadRecipes();


  function loadContent() {
		// $scope.fridge_id = $routeParams.id;

		DataService.saveFridgeId($routeParams.id);

    MainService.getContent($scope.fridge_id)
      .then(function(response) {

      	console.log(response.data);

        $scope.items = response.data;

				$timeout(function() {
					$scope.loading = false;
				}, 100);

      }, function(error) {
        console.warn(error);
      });


    MainService.getSoonObsoleteItems($scope.fridge_id)
		// Todo : Fetch products from fridge content directly
			.then(function(response) {
				$scope.obsolete_items = response.data;
				$timeout(function() {
					$scope.obsolete_loading = false;
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