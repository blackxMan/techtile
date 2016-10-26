(function () {
  'use strict';

  angular
    .module('interventions.backoffice')
    .controller('InterventionsController', InterventionsController);

  InterventionsController.$inject = ['$scope', '$state', '$window', 'interventionResolve', 'Authentication','$http'];

  function InterventionsController($scope, $state, $window, intervention, Authentication,$http) {
    var vm = this;

    vm.intervention = intervention;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.searchIntervention   = null;
    vm.interventionSearch   = interventionSearch;
    vm.interventionChange   = interventionChange;


    /**
     * Search for interventions...
     * remote dataservice call.
     */
    function interventionSearch (searchToken) {
      return $http.get('/api/ajax/prescriptions/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }


    function interventionChange(item){
      if(item)
        vm.intervention.prescriptionId = item.id;
      else
        vm.intervention.prescriptionId = null;
    }

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.intervention.$remove(
          function(res){
            $state.go('backoffice.interventions.list')
          },
          function(err){
            console.log('err intervention');
          }
        );

      }
    }

    // Save Intervention
    function save(isValid) {
      console.log('vm.intervention :');
      console.log(vm.intervention);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interventionForm');
        return false;
      }

      // Create a new intervention, or update the current instance
      vm.intervention.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.interventions.list'); // should we send the User to the list or the updated Intervention's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
