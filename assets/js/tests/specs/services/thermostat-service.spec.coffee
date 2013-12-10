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

        it 'process service results correctly', ->
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

    afterEach ->
        $httpBackend.verifyNoOutstandingExpectation()
        $httpBackend.verifyNoOutstandingRequest()