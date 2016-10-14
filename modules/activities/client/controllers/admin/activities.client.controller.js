(function () {
  'use strict';

  angular
    .module('activities.admin')
    .controller('ActivitiesController', ActivitiesController);

  ActivitiesController.$inject = ['$scope', '$state', '$window', 'activityResolve', 'Authentication','$http','$timeout','$q'];

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

    // list of `manager` value/display objects
    vm.managers        = [{value:1,display:'Fayssal Tahtoub'},{value:2,display:'Youssef El Heddadi'},{value:3,display:'Rachid El Mechhour'},{value:4,display:'Mohammed Zanna'}];
    vm.selectedManager = null;
    vm.searchManager    = null;
    vm.managerSearch   = managerSearch;

    // list of `activities` value/display objects
    vm.activities        = [{value:1,display:'Culture du blé en 2016'},{value:2,display:'Culture du pomme de terre en 2016'},{value:3,display:'Laine Rasé 2016'}];
    vm.selectedActivity = null;
    vm.searchActivity    = null;
    vm.activitySearch   = activitySearch;


    // list of `products` value/display objects
    vm.products        = [{value:1,display:'Blé'},{value:2,display:'Pomme de terre'}];
    vm.selectedProduct = null;
    vm.searchProduct    = null;
    vm.productSearch   = productSearch;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for activities... use $timeout to simulate
     * remote dataservice call.
     */
    function activitySearch (query) {
      var results = query ? vm.activities.filter( createFilterFor(query) ) : vm.activities;
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    }



    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for managers... use $timeout to simulate
     * remote dataservice call.
     */
    function managerSearch (query) {
      var results = query ? vm.managers.filter( createFilterFor(query) ) : vm.managers;
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for products... use $timeout to simulate
     * remote dataservice call.
     */
    function productSearch (query) {
      var results = query ? vm.products.filter( createFilterFor(query) ) : vm.products;
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      console.log(query);
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(data) {
        var queryItem= angular.lowercase(data.display);
        return (queryItem.indexOf(lowercaseQuery) === 0);
      };

    }

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
      vm.activity.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.activities.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
