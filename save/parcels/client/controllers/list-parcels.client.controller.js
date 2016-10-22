(function () {
  'use strict';

  angular
    .module('parcels')
    .controller('ParcelsListController', ParcelsListController);

  ParcelsListController.$inject = ['ParcelsService'];

  function ParcelsListController(ParcelsService) {
    var vm = this;

    vm.parcels = ParcelsService.query();
  }
}());
