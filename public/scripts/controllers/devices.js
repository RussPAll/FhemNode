fhemDotNet.controller('ThermostatListCtrl', function ThermostatListCtrl($scope, $http) {
    $http.get('http://localhost:3000/fhem/fhem?cmd=jsonlist&XHR=1').success(function (data) {
        $scope.devices = data;
    });

    $scope.deviceTemperatureChanged = function (deviceName, newDesiredTemp) {
        $http.put('/devices/' + deviceName + "/desiredTempCommand", { 'NewDesiredTemp': newDesiredTemp}).
            success(function() {
                //alert("Saved a device change");
            });
    };
});