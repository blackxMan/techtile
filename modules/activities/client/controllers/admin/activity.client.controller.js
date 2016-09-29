(function () {
  'use strict';

  angular
    .module('activities.admin')
    .controller('ActivitiesController', ActivitiesController);

  ActivitiesController.$inject = ['$scope', '$state', '$window', 'activityResolve', 'Authentication','$http'];

  function ActivitiesController($scope, $state, $window, activity, Authentication,$http) {
    var vm = this;

    vm.activity = activity;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.activity.$remove(
          function(res){
            $state.go('admin.activities.list')
          },
          function(err){
            console.log('err activities');
          }
        );

      }
    }

    // Save Activity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
        return false;
      }

      // Create a new activity, or update the current instance
      vm.product.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.products.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
