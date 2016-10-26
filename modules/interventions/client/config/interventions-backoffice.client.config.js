(function () {
  'use strict';

  // Configuring the Products backoffice module
  angular
    .module('interventions.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Interventions',
      state: 'backoffice.interventions.list',
      icon:  'dashboard'
    });
  }
}());
