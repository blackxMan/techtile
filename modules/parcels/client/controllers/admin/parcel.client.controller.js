(function () {
  'use strict';

  angular
    .module('parcels.admin')
    .controller('ParcelsController', ParcelsController);

  ParcelsController.$inject = ['$scope', '$state', '$window', 'parcelResolve', 'Authentication'];

  function ParcelsController($scope, $state, $window, parcel, Authentication) {
    var vm = this;

    vm.parcel = parcel;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Parcel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.parcel.$remove($state.go('admin.parcels.list'));
      }
    }

    // Save Parcel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.parcelForm');
        return false;
      }

      // Create a new parcel, or update the current instance
      vm.parcel.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.parcels.list'); // should we send the User to the list or the updated Parcel's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
