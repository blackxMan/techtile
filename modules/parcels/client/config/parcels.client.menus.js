(function () {
  'use strict';

  angular
    .module('parcels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Parcels',
      state: 'parcels',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'parcels', {
      title: 'List Parcels',
      state: 'parcels.list',
      roles: ['*']
    });
  }
}());
