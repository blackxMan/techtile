(function () {
  'use strict';

  angular
    .module('parcels.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.parcels.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parcels/client/views/backoffice/list-parcels.client.view.html',
            controller: 'ParcelsListController',
            controllerAs: 'vm',
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        }
      })
      .state('backoffice.parcels.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parcels/client/views/backoffice/form-parcel.client.view.html',
            controller: 'ParcelsController',
            controllerAs: 'vm',
            resolve: {
              parcelResolve: newParcel
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },
      })
      .state('backoffice.parcels.edit', {
        url: '/:parcelId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parcels/client/views/backoffice/form-parcel.client.view.html',
            controller: 'ParcelsController',
            controllerAs: 'vm',
            resolve: {
              parcelResolve: getParcel
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },

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
    var parcel = new ParcelsService();
    parcel.bornAt = Date.now();
    parcel.position = { type: 'Point', coordinates: [39.807222,-76.984722]};
    parcel.form = { type: 'Point', coordinates: [39.807222,-76.984722]};
    return parcel;
  }
}());
