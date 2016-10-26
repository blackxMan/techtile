(function () {
  'use strict';

  angular
    .module('interventionNatures.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.interventionNatures', {
        abstract: true,
        url: '/intervention-natures',
        template: '<ui-view/>'
      });
  }

  getInterventionNature.$inject = ['$stateParams', 'InterventionNaturesService'];

  function getInterventionNature($stateParams, InterventionNaturesService) {
    return InterventionNaturesService.get({
      interventionNatureId: $stateParams.interventionNatureId
    }).$promise;
  }
}());
