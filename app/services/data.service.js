var DataService = angular.module('DataService', [])
.service("DataService", ['$http', '$rootScope', function($http, $rootScope) {

	// Used to store internal application data

	var stored_datas = {
		fridge_id: -1
	};

	$rootScope.headerUrl = 'header.html';

	function saveFridgeId(fridge_id) {
		stored_datas.fridge_id = fridge_id;
		$rootScope.fridge_id = fridge_id;
	}

	function getFridgeId() {
		return stored_datas.fridge_id;
	}

	return {
		saveFridgeId: saveFridgeId,
		getFridgeId: getFridgeId
	}
}]);