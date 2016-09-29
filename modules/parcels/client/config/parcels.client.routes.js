(function () {
  'use strict';

  angular
    .module('parcels.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('parcels', {
        abstract: true,
        url: '/parcels',
        template: '<ui-view/>'
      })
      .state('parcels.list', {
        url: '',
        templateUrl: 'modules/parcels/client/views/list-parcels.client.view.html',
        controller: 'ParcelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Parcels List'
        }
      })
      .state('parcels.view', {
        url: '/:parcelId',
        templateUrl: 'modules/parcels/client/views/view-parcel.client.view.html',
        controller: 'ParcelsController',
        controllerAs: 'vm',
        resolve: {
          parcelResolve: getParcel
        },
        data: {
          pageTitle: 'Parcel {{ parcelResolve.name }}'
        }
      });
  }

  getParcel.$inject = ['$stateParams', 'ParcelsService'];

  function getParcel($stateParams, ParcelsService) {
    return ParcelsService.get({
      parcelId: $stateParams.parcelId
    }).$promise;
  }
}());
