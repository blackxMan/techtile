(function () {
  'use strict';

  describe('Interventions Route Tests', function () {
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
          mainstate = $state.get('admin.interventions');
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
          liststate = $state.get('admin.interventions.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/interventions/client/views/admin/list-interventions.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InterventionsController,
          mockIntervention;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.interventions.create');
          $templateCache.put('modules/interventions/client/views/admin/form-intervention.client.view.html', '');

          // Create mock intervention
          mockIntervention = new InterventionsService();

          // Initialize Controller
          InterventionsController = $controller('InterventionsController as vm', {
            $scope: $scope,
            interventionResolve: mockIntervention
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.interventionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/interventions/create');
        }));

        it('should attach an intervention to the controller scope', function () {
          expect($scope.vm.intervention.id).toBe(mockIntervention.id);
          expect($scope.vm.intervention.id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/interventions/client/views/admin/form-intervention.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InterventionsController,
          mockIntervention;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.interventions.edit');
          $templateCache.put('modules/interventions/client/views/admin/form-intervention.client.view.html', '');

          // Create mock intervention
          mockIntervention = new InterventionsService({
            id: 12345,
            name: 'An intervention about MEAN',
            description: 'MEAN rocks!'
          });

          // Initialize Controller
          InterventionsController = $controller('InterventionsController as vm', {
            $scope: $scope,
            interventionResolve: mockIntervention
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:interventionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.interventionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            interventionId: 1
          })).toEqual('/admin/interventions/1/edit');
        }));

        it('should attach an intervention to the controller scope', function () {
          expect($scope.vm.intervention.id).toBe(mockIntervention.id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/interventions/client/views/admin/form-intervention.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
