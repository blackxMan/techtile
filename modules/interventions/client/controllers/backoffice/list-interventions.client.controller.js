(function () {
  'use strict';

  angular
    .module('interventions.backoffice')
    .controller('InterventionsListController', InterventionsListController);

  InterventionsListController.$inject = ['InterventionsService','$http','$state'];

  function InterventionsListController(InterventionsService,$http,$state) {
    var vm = this;

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.interventions = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getInterventions = function () {
      vm.promise = $http.get('/api/lazy/interventions',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(interventionId){
      $state.go('backoffice.interventions.edit',{interventionId: interventionId});
    }

    /**
    * delete one or selected item
    */
    vm.deleteItems= function(itemToDelete){
      var selectedIds= [];

      if(itemToDelete){
        selectedIds.push(itemToDelete);
      }else{
        _.each(vm.selectedItems,function(item){
          selectedIds.push(item.id);
        });
      }


      $http.post('api/ajax/interventions/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getInterventions();
        },function(err){
          console.log(err);
        });
    }
  }
}());
