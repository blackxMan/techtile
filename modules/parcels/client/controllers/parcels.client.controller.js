(function () {
  'use strict';

  angular
    .module('parcels')
    .controller('ParcelsController', ParcelsController);

  ParcelsController.$inject = ['$scope', 'parcelResolve', 'Authentication'];

  function ParcelsController($scope, parcel, Authentication) {
    var vm = this;

    vm.parcel = parcel;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
