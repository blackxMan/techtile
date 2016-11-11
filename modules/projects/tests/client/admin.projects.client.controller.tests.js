(function () {
  'use strict';

  describe('Projects Controller Tests', function () {
    // Initialize global variables
    var ProjectsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ProjectsService,
      mockProject;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ProjectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ProjectsService = _ProjectsService_;

      // create mock project
      mockProject = new ProjectsService({
        id: 12345,
        name: 'An Article about MEAN',
        description: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Projects controller.
      ProjectsController = $controller('ProjectsController as vm', {
        $scope: $scope,
        projectResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleProjectPostData;

      beforeEach(function () {
        // Create a sample project object
        sampleProjectPostData = new ProjectsService({
          name: 'An Project about MEAN',
          description: 'MEAN rocks!'
        });

        $scope.vm.project = sampleProjectPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ProjectsService) {
        // Set POST response
        $httpBackend.expectPOST('api/projects', sampleProjectPostData).respond(mockProject);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the project was created
        expect($state.go).toHaveBeenCalledWith('admin.projects.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/projects', sampleProjectPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock project in $scope
        $scope.vm.project = mockProject;
      });

      it('should update a valid project', inject(function (ProjectsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/projects\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.projects.list');
      }));

      it('should set $scope.vm.error if error', inject(function (ProjectsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/projects\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup projects
        $scope.vm.project = mockProject;
      });

      it('should delete the project and redirect to projects', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/projects\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('admin.projects.list');
      });

      it('should should not delete the project and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
