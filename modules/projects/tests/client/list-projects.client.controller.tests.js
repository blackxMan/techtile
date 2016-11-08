(function () {
  'use strict';

  describe('Activities List Controller Tests', function () {
    // Initialize global variables
    var ActivitiesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ActivitiesService,
      mockActivity;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ActivitiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ActivitiesService = _ActivitiesService_;

      // create mock activity
      mockArticle = new ActivitiesService({
        id: 12345,
        name: 'An Activity about MEAN',
        description: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Activities List controller.
      ActivitiesListController = $controller('ActivitiesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockActivityList;

      beforeEach(function () {
        mockActivityList = [mockActivity, mockActivity];
      });

      it('should send a GET request and return all activities', inject(function (ActivitiesService) {
        // Set POST response
        $httpBackend.expectGET('api/activities').respond(mockActivityList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.activities.length).toEqual(2);
        expect($scope.vm.activities[0]).toEqual(mockActivity);
        expect($scope.vm.activities[1]).toEqual(mockActivity);

      }));
    });
  });
}());
