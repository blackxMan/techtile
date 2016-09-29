(function () {
  'use strict';

  angular
    .module('interventions')
    .controller('InterventionsListController', InterventionsListController);

  InterventionsListController.$inject = ['InterventionsService'];

  function InterventionsListController(InterventionsService) {
    var vm = this;

    vm.interventions = InterventionsService.query();
  }
}());
