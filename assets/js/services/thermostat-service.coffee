fhemDotNet.factory('thermostatService', ['$http', ($http) ->
    thermostatService =
        _getReadingWithTimestamp: (device, readingName) ->
            foundReading = _.find device.READINGS, (reading) -> reading[readingName]
            if foundReading then {
                Value: foundReading[readingName],
                TimeStamp: foundReading.measured
            }
            else null


        _getReading: (device, readingName) ->
            foundReading = _.find device.READINGS, (reading) -> reading[readingName]
            if foundReading then foundReading[readingName] else null

        _getDaySchedule: (device, dayOfWeek) ->
            {
                DayOfWeek: dayOfWeek,
                From1: this._getReading(device, dayOfWeek.toLowerCase() + "-from1"),
                To1: this._getReading(device, dayOfWeek.toLowerCase() + "-to1"),
                From2: this._getReading(device, dayOfWeek.toLowerCase() + "-from2"),
                To2: this._getReading(device, dayOfWeek.toLowerCase() + "-to2")
            }            

        _serviceToDomain: (service) ->
            fhtDevices = _.findWhere service.Results, {list: "FHT"}
            $this = this
            return _.map fhtDevices.devices,
                (device) ->
                    {
                        Name: device.NAME,
                        DesiredTemp: $this._getReadingWithTimestamp(device, 'desired-temp'),
                        CurrentTemp: $this._getReadingWithTimestamp(device, 'measured-temp'),
                        Actuator: $this._getReadingWithTimestamp(device, 'actuator'),
                        Mode: $this._getReadingWithTimestamp(device, 'mode'),
                        Schedule : [
                            $this._getDaySchedule(device, "Mon"),
                            $this._getDaySchedule(device, "Tue"),
                            $this._getDaySchedule(device, "Wed"),
                            $this._getDaySchedule(device, "Thu"),
                            $this._getDaySchedule(device, "Fri"),
                            $this._getDaySchedule(device, "Sat"),
                            $this._getDaySchedule(device, "Sun")
                        ]
                    }

        getDeviceList: ->
            url = '/fhem/fhem?cmd=jsonlist&XHR=1'
            $this = this
            return $http.get(url)
                .then (response) ->
                    return $this._serviceToDomain(response.data)
    return thermostatService;
]);