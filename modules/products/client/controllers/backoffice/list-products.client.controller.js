(function () {
  'use strict';

  angular
    .module('products.backoffice')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['ProductsService','$http','$state'];

  function ProductsListController(ProductsService,$http,$state) {
    var vm = this;

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.products = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getProducts = function () {
      vm.promise = $http.get('/api/lazy/products',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(productId){
      $state.go('backoffice.products.edit',{productId: productId});
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


      $http.post('api/ajax/products/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getProducts();
        },function(err){
          console.log(err);
        });

    }
  }
}());
