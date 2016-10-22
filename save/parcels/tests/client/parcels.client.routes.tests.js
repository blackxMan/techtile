(function () {
  'use strict';

  describe('Parcels Route Tests', function () {
    // Initialize global variables
    var $scope,
      ParcelsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ParcelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ParcelsService = _ParcelsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('parcels');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/parcels');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('parcels.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/parcels/client/views/list-parcels.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ParcelsController,
          mockParcel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('parcels.view');
          $templateCache.put('modules/parcels/client/views/view-parcel.client.view.html', '');

          // create mock parcel
          mockParcel = new ParcelsService({
            id: 12345,
            name: 'parcel test 1',
            description: 'parcel test 1 description'
          });

          // Initialize Controller
          ParcelsController = $controller('ParcelsController as vm', {
            $scope: $scope,
            parcelResolve: mockParcel
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:parcelId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.parcelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            parcelId: 1
          })).toEqual('/parcels/1');
        }));

        it('should attach an parcel to the controller scope', function () {
          expect($scope.vm.parcel.id).toBe(mockParcel.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/parcels/client/views/view-parcel.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('parcels.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('parcels/');
          $rootScope.$digest();

          expect($location.path()).toBe('/parcels');
          expect($state.current.templateUrl).toBe('modules/parcels/client/views/list-parcels.client.view.html');
        }));
      });
    });
  });
}());
