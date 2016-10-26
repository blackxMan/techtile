(function () {
  'use strict';

  angular
    .module('interventionNatures.backoffice')
    .controller('InterventionNaturesController', InterventionNaturesController);

  InterventionNaturesController.$inject = ['$scope', '$state', '$window', 'interventionNatureResolve', 'Authentication','$http'];

  function InterventionNaturesController($scope, $state, $window, interventionNature, Authentication,$http) {
    var vm = this;

    vm.interventionNature = interventionNature;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing InterventionNature
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.interventionNature.$remove(
          function(res){
            $state.go('backoffice.interventionNatures.list')
          },
          function(err){
            console.log('err intervention nature');
          }
        );

      }
    }

    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interventionNatureForm');
        return false;
      }

      // Create a new interventionNature, or update the current instance
      vm.interventionNature.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.interventionNatures.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
