(function () {
  'use strict';

  angular
    .module('products')
    .controller('ActivitiesListController', ActivitiesListController);

  ActivitiesListController.$inject = ['ActivitiesService','$http','$state'];

  function ActivitiesListController(ActivitiesService,$http,$state) {
    var vm = this;

    //vm.activities = ActivitiesService.query();

    vm.selectedItems = [];

    console.log('dazt');

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.activities = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    vm.getActivities = function () {
      vm.promise = $http.get('/api/lazy/activities',{params:vm.dtConfig}).then(success,error).$promise;
    };

    vm.edit= function(activityId){
      console.log('edit');
      $state.go('backoffice.admin.activities.edit',{activityId: activityId});
    }

    vm.delete= function(activityId){
      admin.activities.edit({activityId: activity.id})
    }

    vm.deleteItems= function(){
      
    }
  }
}());
