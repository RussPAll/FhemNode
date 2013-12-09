fhemDotNet.controller('ThermostatListCtrl', ["$scope", "$http", "thermostatService", ($scope, $http, thermostatService) ->
    thermostatService.getDeviceList().then (data) ->
        alert("blah")
        $scope.devices = data

    $scope.deviceTemperatureChanged = (deviceName, newDesiredTemp) ->
        url = '/devices/' + deviceName + "/desiredTempCommand"
        ($http.put url, { 'NewDesiredTemp': newDesiredTemp})
            .success () -> alert("test")
]);