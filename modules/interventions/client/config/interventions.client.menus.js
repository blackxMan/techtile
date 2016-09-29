(function () {
  'use strict';

  angular
    .module('interventions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Interventions',
      state: 'interventions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'interventions', {
      title: 'List Interventions',
      state: 'interventions.list',
      roles: ['*']
    });
  }
}());
