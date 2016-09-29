(function () {
  'use strict';

  angular
    .module('parcels.services')
    .factory('ParcelsService', ParcelsService);

  ParcelsService.$inject = ['$resource'];

  function ParcelsService($resource) {
    var Parcel = $resource('api/parcels/:parcelId', {
      parcelId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Parcel.prototype, {
      createOrUpdate: function () {
        var parcel = this;
        return createOrUpdate(parcel);
      }
    });

    return Parcel;

    function createOrUpdate(parcel) {
      if (parcel.id) {
        return parcel.$update(onSuccess, onError);
      } else {
        return parcel.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(parcel) {
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
