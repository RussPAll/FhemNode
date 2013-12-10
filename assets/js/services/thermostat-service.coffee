fhemDotNet.factory('thermostatService', ['$http', ($http) ->
    thermostatService =
        _getReading: (device, readingName) ->
            foundReading = _.find device.READINGS, (reading) -> reading[readingName]
            {
                Value: foundReading[readingName],
                TimeStamp: foundReading.measured
            }

        _serviceToDomain: (service) ->
            fhtDevices = _.findWhere service.Results, {list: "FHT"}
            $this = this
            return _.map fhtDevices.devices,
                (device) ->
                    {
                        Name: device.NAME,
                        DesiredTemp: $this._getReading(device, 'desired-temp'),
                        CurrentTemp: $this._getReading(device, 'measured-temp'),
                        Actuator: $this._getReading(device, 'actuator'),
                        Mode: $this._getReading(device, 'mode')
                    }

        getDeviceList: ->
            url = '/fhem/fhem?cmd=jsonlist&XHR=1'
            $this = this
            return $http.get(url)
                .then (response) ->
                    return $this._serviceToDomain(response.data)
    return thermostatService;
]);