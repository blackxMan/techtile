(function () {
  'use strict';

  angular
    .module('activities.backoffice')
    .controller('ActivitiesController', ActivitiesController);

  ActivitiesController.$inject = ['$scope', '$state', '$window', 'activityResolve', 'Authentication','$http','$timeout','$q','ActivitiesService','ProductsService','UsersService'];

  function ActivitiesController($scope, $state, $window, activity, Authentication, $http, $timeout, $q) {
    var vm = this;
    activity.startAt = new Date(activity.startAt);
    activity.endAt = new Date(activity.endAt);
    vm.activity = activity;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.searchManager    = null;
    vm.managerSearch    = managerSearch;

    vm.searchActivity   = null;
    vm.activitySearch   = activitySearch;

    vm.searchProduct    = null;
    vm.productSearch    = productSearch;

    vm.productChange    = productChange;
    vm.activityChange   = activityChange;
    vm.managerChange    = managerChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for activities... use $timeout to simulate
     * remote dataservice call.
     */
    function activitySearch (searchToken) {
      return $http.get('/api/ajax/activities/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }



    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for managers... use $timeout to simulate
     * remote dataservice call.
     */
    function managerSearch (searchToken) {
      return $http.get('/api/ajax/managers/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for products... use $timeout to simulate
     * remote dataservice call.
     */
    function productSearch (searchToken) {
      return $http.get('/api/ajax/products/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.activity.$remove(
          function(res){
            $state.go('backoffice.activities.list')
          },
          function(err){
            console.log('err activities');
          }
        );

      }
    }

    function productChange(item){
      if(item)
        vm.activity.product_id = item.id;
      else
        vm.activity.product_id = null;
    }

    function managerChange(item){
      if(item)
        vm.activity.manager_id = item.id;
      else
        vm.activity.manager_id = null;
    }

    function activityChange(item){
      if(item)
        vm.activity.parent_id = item.id;
      else
        vm.activity.parent_id = null;
    }

    // Save Activity
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
        return false;
      }

      // Create a new activity, or update the current instance
      vm.activity.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.activities.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
