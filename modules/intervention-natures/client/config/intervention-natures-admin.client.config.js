(function () {
  'use strict';

  // Configuring the InterventionNatures Admin module
  angular
    .module('interventionNatures.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Intervention Natures',
      state: 'admin.interventionNatures.list'
    });
  }
}());
