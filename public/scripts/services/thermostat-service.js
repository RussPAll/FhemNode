fhemDotNet.factory('thermostatService', ['$http', function($http) {
	var thermostatService = {
		getDeviceList: function() {
			var promise = $http.get('http://localhost:3000/fhem/fhem?cmd=jsonlist&XHR=1').then(function (response) {
				return response.data;
			});
			return promise;
		}  	
	};
	return thermostatService;
}]);