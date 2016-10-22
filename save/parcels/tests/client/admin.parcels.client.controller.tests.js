(function () {
  'use strict';

  describe('Parcels Controller Tests', function () {
    // Initialize global variables
    var ParcelsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ParcelsService,
      mockParcel;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ParcelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ParcelsService = _ParcelsService_;

      // create mock parcel
      mockParcel = new ParcelsService({
        id: 12345,
        name: 'An Article about MEAN',
        description: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Parcels controller.
      ParcelsController = $controller('ParcelsController as vm', {
        $scope: $scope,
        parcelResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleParcelPostData;

      beforeEach(function () {
        // Create a sample parcel object
        sampleParcelPostData = new ParcelsService({
          name: 'An Parcel about MEAN',
          description: 'MEAN rocks!'
        });

        $scope.vm.parcel = sampleParcelPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ParcelsService) {
        // Set POST response
        $httpBackend.expectPOST('api/parcels', sampleParcelPostData).respond(mockParcel);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the parcel was created
        expect($state.go).toHaveBeenCalledWith('admin.parcels.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/parcels', sampleParcelPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock parcel in $scope
        $scope.vm.parcel = mockParcel;
      });

      it('should update a valid parcel', inject(function (ParcelsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/parcels\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.parcels.list');
      }));

      it('should set $scope.vm.error if error', inject(function (ParcelsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/parcels\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup parcels
        $scope.vm.parcel = mockParcel;
      });

      it('should delete the parcel and redirect to parcels', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/parcels\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('admin.parcels.list');
      });

      it('should should not delete the parcel and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
