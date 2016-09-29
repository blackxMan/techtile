(function () {
  'use strict';

  // Configuring the Interventions Admin module
  angular
    .module('interventions.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Interventions',
      state: 'admin.interventions.list'
    });
  }
}());
