fhemDotNet.controller('ThermostatListCtrl', ["$scope", "$http", "thermostatService", ($scope, $http, thermostatService) ->
    thermostatService.getDeviceList().then (data) ->
        $scope.devices = _.map data, ->
            return {
                
            }

    $scope.deviceTemperatureChanged = (deviceName, newDesiredTemp) ->
        url = '/devices/' + deviceName + "/desiredTempCommand"
        ($http.put url, { 'NewDesiredTemp': newDesiredTemp})
            .success () -> alert("test")
]);