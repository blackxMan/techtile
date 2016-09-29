(function () {
  'use strict';

  angular
    .module('interventionNatures.services')
    .factory('InterventionNaturesService', InterventionNaturesService);

  InterventionNaturesService.$inject = ['$resource'];

  function InterventionNaturesService($resource) {
    var InterventionNature = $resource('api/intervention-natures/:interventionNatureId', {
      interventionNatureId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(InterventionNature.prototype, {
      createOrUpdate: function () {
        var interventionNature = this;
        return createOrUpdate(interventionNature);
      }
    });

    return InterventionNature;

    function createOrUpdate(interventionNature) {
      if (interventionNature.id) {
        return interventionNature.$update(onSuccess, onError);
      } else {
        return interventionNature.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(interventionNature) {
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
