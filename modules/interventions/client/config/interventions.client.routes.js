(function () {
  'use strict';

  angular
    .module('interventions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('interventions', {
        abstract: true,
        url: '/interventions',
        template: '<ui-view/>'
      })
      .state('interventions.list', {
        url: '',
        templateUrl: 'modules/interventions/client/views/list-interventions.client.view.html',
        controller: 'InterventionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Interventions List'
        }
      })
      .state('interventions.view', {
        url: '/:interventionId',
        templateUrl: 'modules/interventions/client/views/view-intervention.client.view.html',
        controller: 'InterventionsController',
        controllerAs: 'vm',
        resolve: {
          interventionResolve: getIntervention
        },
        data: {
          pageTitle: 'Intervention {{ interventionResolve.name }}'
        }
      });
  }

  getIntervention.$inject = ['$stateParams', 'InterventionsService'];

  function getIntervention($stateParams, InterventionsService) {
    return InterventionsService.get({
      interventionId: $stateParams.interventionId
    }).$promise;
  }
}());
