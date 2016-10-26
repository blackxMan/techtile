(function () {
  'use strict';

  angular
    .module('interventions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.interventions', {
        abstract: true,
        url: '/interventions',
        template: '<ui-view/>'
      });
  }

  getIntervention.$inject = ['$stateParams', 'InterventionsService'];

  function getIntervention($stateParams, InterventionsService) {
    return InterventionsService.get({
      interventionId: $stateParams.productId
    }).$promise;
  }
}());
