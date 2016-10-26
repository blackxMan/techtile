(function () {
  'use strict';

  describe('Products Route Tests', function () {
    // Initialize global variables
    var $scope,
      InterventionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InterventionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InterventionsService = _InterventionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('interventions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/interventions');
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
          liststate = $state.get('interventions.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/interventions/client/views/list-interventions.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InterventionsController,
          mockIntervention;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('interventions.view');
          $templateCache.put('modules/interventions/client/views/view-intervention.client.view.html', '');

          // create mock Intervention
          mockIntervention = new InterventionsService({
            id: 12345,
            name: 'Intervention test 1',
            description: 'Intervention test 1 description'
          });

          // Initialize Controller
          InterventionsController = $controller('InterventionsController as vm', {
            $scope: $scope,
            interventionResolve: mockIntervention
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:interventionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.interventionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            interventionId: 1
          })).toEqual('/interventions/1');
        }));

        it('should attach an Intervention to the controller scope', function () {
          expect($scope.vm.intervention.id).toBe(mockIntervention.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/interventions/client/views/view-intervention.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('interventions.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('interventions/');
          $rootScope.$digest();

          expect($location.path()).toBe('/interventions');
          expect($state.current.templateUrl).toBe('modules/interventions/client/views/list-interventions.client.view.html');
        }));
      });
    });
  });
}());
