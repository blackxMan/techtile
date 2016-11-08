(function () {
  'use strict';

  angular
    .module('projects.services')
    .factory('ProjectsService', ProjectsService);

  ProjectsService.$inject = ['$resource','$http'];

  function ProjectsService($resource,$http) {
    var Project = $resource('api/projects/:projectId', {
      projectId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Project.prototype, {
      createOrUpdate: function () {
        var project = this;
        return createOrUpdate(project);
      }
    });

    return Project;

    function createOrUpdate(project) {
      if (project.id) {
        return project.$update(onSuccess, onError);
      } else {
        return project.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(project) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());
