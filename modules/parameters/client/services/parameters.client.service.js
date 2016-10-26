(function () {
  'use strict';

  angular
    .module('parameters.services')
    .factory('ParametersService', ParametersService);

  ParametersService.$inject = ['$resource'];

  function ParametersService($resource) {
    var Parameter = $resource('api/parameters/:parameterId', {
      parameterId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Parameter.prototype, {
      createOrUpdate: function () {
        var parameter = this;
        return createOrUpdate(parameter);
      }
    });

    return Parameter;

    function createOrUpdate(parameter) {
      if (parameter.id) {
        return parameter.$update(onSuccess, onError);
      } else {
        return parameter.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(parameter) {
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
