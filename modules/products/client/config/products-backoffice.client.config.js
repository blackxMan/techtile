(function () {
  'use strict';

  // Configuring the Products backoffice module
  angular
    .module('products.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Products',
      state: 'backoffice.products.list',
      icon:  'dashboard'
    });
  }
}());
