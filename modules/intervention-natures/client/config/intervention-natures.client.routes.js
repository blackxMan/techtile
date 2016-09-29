(function () {
  'use strict';

  angular
    .module('interventionNatures.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('interventionNatures', {
        abstract: true,
        url: '/intervention-natures',
        template: '<ui-view/>'
      })
      .state('interventionNatures.list', {
        url: '',
        templateUrl: 'modules/intervention-natures/client/views/list-intervention-nature.client.view.html',
        controller: 'InterventionNaturesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'InterventionNature List'
        }
      })
      .state('interventionNatures.view', {
        url: '/:interventionNatureId',
        templateUrl: 'modules/intervention-natures/client/views/view-intervention-nature.client.view.html',
        controller: 'InterventionNaturesController',
        controllerAs: 'vm',
        resolve: {
          interventionNatureResolve: getInterventionNature
        },
        data: {
          pageTitle: 'InterventionNature {{ interventionNatureResolve.name }}'
        }
      });
  }

  getInterventionNature.$inject = ['$stateParams', 'InterventionNaturesService'];

  function getInterventionNature($stateParams, InterventionNaturesService) {
    return InterventionNaturesService.get({
      interventionNatureId: $stateParams.interventionNatureId
    }).$promise;
  }
}());
