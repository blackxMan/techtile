(function () {
  'use strict';

  angular
    .module('interventionNatures.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.interventionNatures', {
        abstract: true,
        url: '/intervention-natures',
        template: '<ui-view/>'
      })
      .state('admin.interventionNatures.list', {
        url: '',
        templateUrl: 'modules/intervention-natures/client/views/admin/list-intervention-natures.client.view.html',
        controller: 'InterventionNaturesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.interventionNatures.create', {
        url: '/create',
        templateUrl: 'modules/intervention-natures/client/views/admin/form-intervention-nature.client.view.html',
        controller: 'InterventionNaturesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          interventionNatureResolve: newInterventionNature
        }
      })
      .state('admin.interventionNatures.edit', {
        url: '/:interventionNatureId/edit',
        templateUrl: 'modules/intervention-natures/client/views/admin/form-intervention-nature.client.view.html',
        controller: 'InterventionNaturesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          interventionNatureResolve: getInterventionNature
        }
      });
  }

  getInterventionNature.$inject = ['$stateParams', 'InterventionNaturesService'];

  function getInterventionNature($stateParams, InterventionNaturesService) {
    return InterventionNaturesService.get({
      interventionNatureId: $stateParams.interventionNatureId
    }).$promise;
  }

  newInterventionNature.$inject = ['InterventionNaturesService'];

  function newInterventionNature(InterventionNaturesService) {
    return new InterventionNaturesService();
  }
}());
