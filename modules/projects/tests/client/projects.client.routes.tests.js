(function () {
  'use strict';

  describe('Activities Route Tests', function () {
    // Initialize global variables
    var $scope,
      ActivitiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ActivitiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ActivitiesService = _ActivitiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('activities');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/activities');
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
          liststate = $state.get('activities.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/activities/client/views/list-activities.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ActivitiesController,
          mockActivity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('activities.view');
          $templateCache.put('modules/activities/client/views/view-activity.client.view.html', '');

          // create mock activity
          mockActivity = new ActivitiesService({
            id: 12345,
            name: 'activity test 1',
            description: 'activity test 1 description'
          });

          // Initialize Controller
          ActivitiesController = $controller('ActivitiesController as vm', {
            $scope: $scope,
            activityResolve: mockActivity
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:activityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.activityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            activityId: 1
          })).toEqual('/activities/1');
        }));

        it('should attach an activity to the controller scope', function () {
          expect($scope.vm.activity.id).toBe(mockActivity.id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/activities/client/views/view-activity.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('activities.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('activities/');
          $rootScope.$digest();

          expect($location.path()).toBe('/activities');
          expect($state.current.templateUrl).toBe('modules/activities/client/views/list-activities.client.view.html');
        }));
      });
    });
  });
}());
