(function () {
  'use strict';

  angular
    .module('interventionNatures')
    .controller('InterventionNaturesListController', InterventionNaturesListController);

  InterventionNaturesListController.$inject = ['InterventionNaturesService'];

  function InterventionNaturesListController(InterventionNaturesService) {
    var vm = this;

    vm.interventionNatures = InterventionNaturesService.query();
  }
}());
