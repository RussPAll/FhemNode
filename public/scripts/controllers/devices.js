fhemDotNet.controller('ThermostatListCtrl', ["$scope", "$http", "thermostatService", function ThermostatListCtrl($scope, $http, thermostatService) {

	thermostatService.getDeviceList().then(function(data) {
        $scope.devices = data;
	});

    $scope.deviceTemperatureChanged = function (deviceName, newDesiredTemp) {
        $http.put('/devices/' + deviceName + "/desiredTempCommand", { 'NewDesiredTemp': newDesiredTemp}).
            success(function() {
                //alert("Saved a device change");
            });
    };
}]);