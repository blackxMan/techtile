(function () {
  'use strict';

  angular
    .module('parcels.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.parcels', {
        abstract: true,
        url: '/parcels',
        template: '<ui-view/>'
      })
      .state('admin.parcels.list', {
        url: '',
        templateUrl: 'modules/parcels/client/views/admin/list-parcels.client.view.html',
        controller: 'ParcelsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.parcels.create', {
        url: '/create',
        templateUrl: 'modules/parcels/client/views/admin/form-parcel.client.view.html',
        controller: 'ParcelsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          parcelResolve: newParcel
        }
      })
      .state('admin.parcels.edit', {
        url: '/:parcelId/edit',
        templateUrl: 'modules/parcels/client/views/admin/form-parcel.client.view.html',
        controller: 'ParcelsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          parcelResolve: getParcel
        }
      });
  }

  getParcel.$inject = ['$stateParams', 'ParcelsService'];

  function getParcel($stateParams, ParcelsService) {
    return ParcelsService.get({
      parcelId: $stateParams.parcelId
    }).$promise;
  }

  newParcel.$inject = ['ParcelsService'];

  function newParcel(ParcelsService) {
    return new ParcelsService();
  }
}());
