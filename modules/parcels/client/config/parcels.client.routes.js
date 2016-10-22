(function () {
  'use strict';

  angular
    .module('parcels.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.parcels', {
        abstract: true,
        url: '/parcels',
        template: '<ui-view/>'
      });
  }

  getParcel.$inject = ['$stateParams', 'ParcelsService'];

  function getParcel($stateParams, ParcelsService) {
    return ParcelsService.get({
      parcelId: $stateParams.parcelId
    }).$promise;
  }
}());
