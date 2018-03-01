'use strict';

angular.module('myApp.new-product', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/product/new', {
		templateUrl: 'new-product/new-product.html',
		controller: 'NewProductCtrl'
	});
}])

.controller('NewProductCtrl', ['$scope', 'NewProductService', '$timeout', '$location', 'RecipeAdviserService', 'ApiService', function($scope, NewProductService, $timeout, $location, RecipeAdviserService, ApiService) {

  $scope.loading = true;
	$scope.updating = false;

	$scope.headerUrl = "header.html";

	$scope.products = [];


	function addNewProduct() { // Reset the new_product form
		$scope.new_product = {
			name: '',
			unit: '',
			description: ''
		};
	}
	function updateProduct(product) { // Move the product from the list to the form
		$scope.updating = true;
		$scope.new_product = product;
	}


	loadProducts(); // main load of the page
	function loadProducts() {
		$timeout(function() {
			$scope.loading = true;
		}, 100);

		addNewProduct();


		ApiService.get("products").then(
			function(response) {
				$scope.products = response.data;

				$timeout(function() {
					$scope.loading = false;
				}, 100);
			},
			function(error) {
				console.warn(error);
			}
		)
	}


	$scope.functions = {
		deleteProduct: deleteProduct,
		updateProduct: updateProduct,
		updateSaveProduct: updateSaveProduct,
		addProduct: addProduct
	};

	function addProduct() { // Save the new product in the database
		ApiService.post("products", $scope.new_product).then(
			function(response) {
				$scope.products.push(response.data);
			}, function(error) {
				console.warn(error);
			}
		)
	}

	function updateSaveProduct() {
		ApiService.put("products/" + $scope.new_product.id, $scope.new_product).then(
			function(response) {
				$scope.updating = false;
				addNewProduct();
			},
			function(error) {
				console.warn(error);

			}
		)
	}

	function deleteProduct(product) {
		ApiService.delete("products/" + product.id).then(
			function(response) {
				loadProducts();
			},
			function(error) {
				console.warn(error);
			}
		)

	}






}]);