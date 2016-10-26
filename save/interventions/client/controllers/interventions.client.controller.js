(function () {
  'use strict';

  angular
    .module('interventions')
    .controller('InterventionsController', InterventionsController);

  InterventionsController.$inject = ['$scope', 'interventionResolve', 'Authentication'];

  function InterventionsController($scope, intervention, Authentication) {
    var vm = this;

    vm.intervention = intervention;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
