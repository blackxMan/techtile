(function () {
  'use strict';

  angular
    .module('interventions.services')
    .factory('InterventionsService', InterventionsService);

  InterventionsService.$inject = ['$resource'];

  function InterventionsService($resource) {
    var Intervention = $resource('api/interventions/:interventionId', {
      interventionId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Intervention.prototype, {
      createOrUpdate: function () {
        var intervention = this;
        return createOrUpdate(intervention);
      }
    });

    return Intervention;

    function createOrUpdate(intervention) {
      if (intervention.id) {
        return intervention.$update(onSuccess, onError);
      } else {
        return intervention.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(intervention) {
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
