(function () {
  'use strict';

  angular
    .module('interventionNatures.backoffice')
    .controller('InterventionNaturesListController', InterventionNaturesListController);

  InterventionNaturesListController.$inject = ['InterventionNaturesService','$http','$state'];

  function InterventionNaturesListController(InterventionNaturesService,$http,$state) {
    var vm = this;

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.interventionNatures = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getInterventionNatures = function () {
      vm.promise = $http.get('/api/lazy/intervention-natures',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(interventionNatureId){
      $state.go('backoffice.interventionNatures.edit',{interventionNatureId: interventionNatureId});
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


      $http.post('api/ajax/intervention-natures/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getInterventionNatures();
        },function(err){
          console.log(err);
        });

    }
  }
}());
