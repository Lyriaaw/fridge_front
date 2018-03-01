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

	$scope.new_product = {
		name: '',
		unit: '',
		description: ''
	};

	$scope.addProduct = addProduct;
	function addProduct() {
		console.log($scope.new_product);

		ApiService.post("products", $scope.new_product).then(
			function(response) {
				$scope.products.push(response.data);
			}, function(error) {
				console.warn(error);
			}
		)
	}

	loadProducts();
	function loadProducts() {
		$scope.loading = true;
		ApiService.get("products").then(
			function(response) {
				$scope.products = response.data;

				$timeout(function() {
					$scope.loading = false;
				}, 10);
			},
			function(error) {

			}
		)
	}


	$scope.functions = {
		deleteProduct: deleteProduct,
		updateProduct: updateProduct,
		updateSaveProduct: updateSaveProduct,
	};


	function deleteProduct(product) {
		console.warn("Deleting " + product.name);

		ApiService.delete("products/" + product.id).then(
			function(response) {
				loadProducts();
			},
			function(error) {
				console.warn(error);
			}
		)

	}

	function updateProduct(product) {
		console.log("Updating" + product.name);
		$scope.updating = true;
		$scope.new_product = product;
	}

	function updateSaveProduct() {
		console.log("Sending");
		ApiService.put("products/" + $scope.new_product.id, $scope.new_product).then(
			function(response) {
				console.log("Changed successfully");
				$scope.updating = false;
				$scope.new_product = {
					name: '',
					unit: '',
					description: ''
				};


			},
			function(error) {
				console.warn(error);

			}
		)
	}





}]);