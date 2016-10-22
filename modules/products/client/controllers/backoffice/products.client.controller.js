(function () {
  'use strict';

  angular
    .module('products.backoffice')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', '$window', 'productResolve', 'Authentication','$http'];

  function ProductsController($scope, $state, $window, product, Authentication,$http) {
    var vm = this;

    product.bornAt = new Date(product.bornAt);

    vm.product = product;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove(
          function(res){
            $state.go('backoffice.products.list')
          },
          function(err){
            console.log('err product');
          }
        );

      }
    }

    // Save Product
    function save(isValid) {
      console.log('vm.product :');
      console.log(vm.product);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // Create a new product, or update the current instance
      vm.product.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.products.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
