var MainService = angular.module('MainService', [])

.service('MainService', ['ApiService', function(ApiService) {
var mainServiceInstance = {
	getContent: getFridgeContent,
	getSoonObsoleteItems: getSoonObsoleteItems,
	getCurrentProducts: getCurrentProducts,
	saveItem: saveItem,
	findAvailableRecipes: findAvailableRecipes
};
// Todo : Clean



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
