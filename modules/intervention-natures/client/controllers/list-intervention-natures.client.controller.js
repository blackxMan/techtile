(function () {
  'use strict';

  angular
    .module('interventionNatures')
    .controller('InterventionNaturesListController', InterventionsListController);

  InterventionNaturesListController.$inject = ['InterventionNaturesService'];

  function InterventionNaturesListController(InterventionNaturesService) {
    var vm = this;

    vm.interventionNatures = InterventionNaturesService.query();
  }
}());
