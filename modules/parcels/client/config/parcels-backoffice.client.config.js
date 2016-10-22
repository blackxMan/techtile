(function () {
  'use strict';

  // Configuring the Parcels backoffice module
  angular
    .module('parcels.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Parcels',
      state: 'backoffice.parcels.list',
      icon:  'dashboard'
    });
  }
}());
