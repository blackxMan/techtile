(function () {
  'use strict';

  angular
    .module('products.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.products.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/products/client/views/backoffice/list-products.client.view.html',
            controller: 'ProductsListController',
            controllerAs: 'vm',
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        }
      })
      .state('backoffice.products.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/products/client/views/backoffice/form-product.client.view.html',
            controller: 'ProductsController',
            controllerAs: 'vm',
            resolve: {
              productResolve: newProduct
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },
      })
      .state('backoffice.products.edit', {
        url: '/:productId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/products/client/views/backoffice/form-product.client.view.html',
            controller: 'ProductsController',
            controllerAs: 'vm',
            resolve: {
              productResolve: getProduct
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },

      });
  }

  getProduct.$inject = ['$stateParams', 'ProductsService'];

  function getProduct($stateParams, ProductsService) {
    return ProductsService.get({
      productId: $stateParams.productId
    }).$promise;
  }

  newProduct.$inject = ['ProductsService'];

  function newProduct(ProductsService) {
    var product = new ProductsService();
    product.bornAt = Date.now();
    return product;
  }
}());
