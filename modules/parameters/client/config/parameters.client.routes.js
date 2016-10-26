(function () {
  'use strict';

  angular
    .module('parameters.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.parameters', {
        abstract: true,
        url: '/parameters',
        template: '<ui-view/>'
      });
  }

  getParameter.$inject = ['$stateParams', 'ParametersService'];

  function getParameter($stateParams, ParametersService) {
    return ParametersService.get({
      parameterId: $stateParams.parameterId
    }).$promise;
  }
}());
