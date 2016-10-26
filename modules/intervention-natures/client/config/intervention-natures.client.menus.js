(function () {
  'use strict';

  angular
    .module('interventionNatures')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Intervention Natures',
      state: 'interventionNatures',
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
