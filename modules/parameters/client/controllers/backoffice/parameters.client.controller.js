(function () {
  'use strict';

  angular
    .module('parameters.backoffice')
    .controller('ParametersController', ParametersController);

  ParametersController.$inject = ['$scope', '$state', '$window', 'parameterResolve', 'Authentication','$http'];

  function ParametersController($scope, $state, $window, parameter, Authentication,$http) {
    var vm = this;

    vm.parameter = parameter;
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
            $state.go('backoffice.parameters.list')
          },
          function(err){
            console.log('err parameter');
          }
        );

      }
    }

    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.parameterForm');
        return false;
      }

      // Create a new interventionNature, or update the current instance
      vm.parameter.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.parameters.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
