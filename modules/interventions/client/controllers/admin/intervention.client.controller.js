(function () {
  'use strict';

  angular
    .module('interventions.admin')
    .controller('InterventionsController', ProductsController);

  InterventionsController.$inject = ['$scope', '$state', '$window', 'intervetionResolve', 'Authentication','$http'];

  function InterventionsController($scope, $state, $window, intervention, Authentication,$http) {
    var vm = this;

    vm.intervention = intervention;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Intervention
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.intervention.$remove(
          function(res){
            $state.go('admin.interventions.list')
          },
          function(err){
            console.log('err intervention');
          }
        );

      }
    }

    // Save Intervention
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interventionForm');
        return false;
      }

      // Create a new intervention, or update the current instance
      vm.intervention.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.interventions.list'); // should we send the User to the list or the updated Intervention's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
