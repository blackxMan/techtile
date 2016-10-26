(function () {
  'use strict';

  angular
    .module('parameters')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Parameters',
      state: 'parameters',
      type: 'dropdown',
      roles: ['*']
    });

    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'products', {
    //   title: 'List Products',
    //   state: 'products.list',
    //   roles: ['*']
    // });
  }
}());
