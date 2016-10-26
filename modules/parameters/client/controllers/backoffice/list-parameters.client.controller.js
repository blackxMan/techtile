(function () {
  'use strict';

  angular
    .module('parameters.backoffice')
    .controller('ParametersListController', ParametersListController);

  ParametersListController.$inject = ['ParametersService','$http','$state'];

  function ParametersListController(ParametersService,$http,$state) {
    var vm = this;

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.parameters = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getParameters = function () {
      vm.promise = $http.get('/api/lazy/parameters',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(parameterId){
      $state.go('backoffice.parameters.edit',{parameterId: parameterId});
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


      $http.post('api/ajax/parameters/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getParameters();
        },function(err){
          console.log(err);
        });

    }
  }
}());
