(function () {
  'use strict';

  angular
    .module('interventions.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.interventions', {
        abstract: true,
        url: '/interventions',
        template: '<ui-view/>'
      })
      .state('admin.interventions.list', {
        url: '',
        templateUrl: 'modules/interventions/client/views/admin/list-interventions.client.view.html',
        controller: 'InterventionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.interventions.create', {
        url: '/create',
        templateUrl: 'modules/interventions/client/views/admin/form-intervention.client.view.html',
        controller: 'InterventionsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          interventionResolve: newIntervention
        }
      })
      .state('admin.interventions.edit', {
        url: '/:interventionId/edit',
        templateUrl: 'modules/interventions/client/views/admin/form-intervention.client.view.html',
        controller: 'InterventionsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          interventionResolve: getIntervention
        }
      });
  }

  getIntervention.$inject = ['$stateParams', 'InterventionsService'];

  function getIntervention($stateParams, InterventionsService) {
    return InterventionsService.get({
      interventionId: $stateParams.interventionId
    }).$promise;
  }

  newIntervention.$inject = ['InterventionsService'];

  function newIntervention(InterventionsService) {
    return new InterventionsService();
  }
}());
