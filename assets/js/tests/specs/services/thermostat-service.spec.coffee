describe 'Thermostat Service', ->
    service = null
    $httpBackend = null

    beforeEach ->
        module 'fhemDotNet'
        inject (thermostatService, _$httpBackend_) ->
            service = thermostatService;
            $httpBackend = _$httpBackend_;

    describe 'getDeviceList', ->
        it 'should invoke service', ->
            $httpBackend.expectGET('/fhem/fhem?cmd=jsonlist&XHR=1')
                .respond(window.getDeviceList_ValidDevice);
            service.getDeviceList();
            $httpBackend.flush();

        it 'processes service results correctly', ->
            $httpBackend.expectGET('/fhem/fhem?cmd=jsonlist&XHR=1')
                .respond(window.getDeviceList_ValidDevice);
            response = {}
            service.getDeviceList().then((data) -> response = data);
            $httpBackend.flush();
            expect(response.length).toBe(1)
            expect(response[0].Name).toBe("whiteRoom")
            expect(response[0].DesiredTemp.Value).toBe('18.5')
            expect(response[0].DesiredTemp.TimeStamp).toBe('2013-12-10 19:30:32')
            expect(response[0].CurrentTemp.Value).toBe('19.0')
            expect(response[0].CurrentTemp.TimeStamp).toBe('2013-12-10 21:59:24')
            expect(response[0].Actuator.Value).toBe('0%')
            expect(response[0].Actuator.TimeStamp).toBe('2013-12-10 22:05:11')
            expect(response[0].Mode.Value).toBe('auto')
            expect(response[0].Mode.TimeStamp).toBe('2013-12-10 04:08:23')

        it 'processes missing results correctly', ->
            $httpBackend.expectGET('/fhem/fhem?cmd=jsonlist&XHR=1')
                .respond(window.getDeviceList_ValidDeviceWithNoReadings);
            response = {}
            service.getDeviceList().then((data) -> response = data);
            $httpBackend.flush();
            expect(response.length).toBe(1)
            expect(response[0].Name).toBe("whiteRoom")
            expect(response[0].DesiredTemp).toBeNull()
            expect(response[0].CurrentTemp).toBeNull()
            expect(response[0].Actuator).toBeNull()
            expect(response[0].Mode).toBeNull()

        it 'reads device schedules correctly', ->
            $httpBackend.expectGET('/fhem/fhem?cmd=jsonlist&XHR=1')
                .respond(window.getDeviceList_ValidDevice);
            response = {}
            service.getDeviceList().then((data) -> response = data);
            $httpBackend.flush();
            expect(response.length).toBe(1)
            expect(response[0].Schedule[0].From1).toBe("01:00")
            expect(response[0].Schedule[0].To1).toBe("01:15")
            expect(response[0].Schedule[0].From2).toBe("01:30")
            expect(response[0].Schedule[0].To2).toBe("01:45")
            expect(response[0].Schedule[1].From1).toBe("02:00")
            expect(response[0].Schedule[1].To1).toBe("02:15")
            expect(response[0].Schedule[1].From2).toBe("02:30")
            expect(response[0].Schedule[1].To2).toBe("02:45")
            expect(response[0].Schedule[2].From1).toBe("03:00")
            expect(response[0].Schedule[2].To1).toBe("03:15")
            expect(response[0].Schedule[2].From2).toBe("03:30")
            expect(response[0].Schedule[2].To2).toBe("03:45")
            expect(response[0].Schedule[3].From1).toBe("04:00")
            expect(response[0].Schedule[3].To1).toBe("04:15")
            expect(response[0].Schedule[3].From2).toBe("04:30")
            expect(response[0].Schedule[3].To2).toBe("04:45")
            expect(response[0].Schedule[4].From1).toBe("05:00")
            expect(response[0].Schedule[4].To1).toBe("05:15")
            expect(response[0].Schedule[4].From2).toBe("05:30")
            expect(response[0].Schedule[4].To2).toBe("05:45")
            expect(response[0].Schedule[5].From1).toBe("06:00")
            expect(response[0].Schedule[5].To1).toBe("06:15")
            expect(response[0].Schedule[5].From2).toBe("06:30")
            expect(response[0].Schedule[5].To2).toBe("06:45")
            expect(response[0].Schedule[6].From1).toBe("07:00")
            expect(response[0].Schedule[6].To1).toBe("07:15")
            expect(response[0].Schedule[6].From2).toBe("07:30")
            expect(response[0].Schedule[6].To2).toBe("07:45")

    afterEach ->
        $httpBackend.verifyNoOutstandingExpectation()
        $httpBackend.verifyNoOutstandingRequest()