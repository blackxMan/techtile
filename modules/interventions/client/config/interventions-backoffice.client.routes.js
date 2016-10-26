(function () {
  'use strict';

  angular
    .module('interventions.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.interventions.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/interventions/client/views/backoffice/list-interventions.client.view.html',
            controller: 'InterventionsListController',
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
      .state('backoffice.interventions.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/interventions/client/views/backoffice/form-intervention.client.view.html',
            controller: 'InterventionsController',
            controllerAs: 'vm',
            resolve: {
              interventionResolve: newIntervention
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
      .state('backoffice.interventions.edit', {
        url: '/:interventionId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/interventions/client/views/backoffice/form-intervention.client.view.html',
            controller: 'InterventionsController',
            controllerAs: 'vm',
            resolve: {
              interventionResolve: getIntervention
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

  getIntervention.$inject = ['$stateParams', 'InterventionsService'];

  function getIntervention($stateParams, InterventionsService) {
    return InterventionsService.get({
      interventionId: $stateParams.productId
    }).$promise;
  }

  newIntervention.$inject = ['InterventionsService'];

  function newIntervention(InterventionsService) {
    var intervention = new InterventionsService();
    return intervention;
  }
}());
