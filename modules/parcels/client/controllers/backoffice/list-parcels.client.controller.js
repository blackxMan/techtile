(function () {
  'use strict';

  angular
    .module('parcels.backoffice')
    .controller('ParcelsListController', ParcelsListController);

  ParcelsListController.$inject = ['ParcelsService','$http','$state'];

  function ParcelsListController(ParcelsService,$http,$state) {
    var vm = this;

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.parcels = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getParcels = function () {
      vm.promise = $http.get('/api/lazy/parcels',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(parcelId){
      $state.go('backoffice.parcels.edit',{parcelId: parcelId});
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


      $http.post('api/ajax/parcels/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getParcels();
        },function(err){
          console.log(err);
        });

    }
  }
}());
