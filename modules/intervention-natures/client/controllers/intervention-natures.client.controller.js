(function () {
  'use strict';

  angular
    .module('interventionNatures')
    .controller('InterventionNaturesController', InterventionNaturesController);

  InterventionNaturesController.$inject = ['$scope', 'interventionNatureResolve', 'Authentication'];

  function InterventionNaturesController($scope, interventionNature, Authentication) {
    var vm = this;

    vm.interventionNature = interventionNature;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
