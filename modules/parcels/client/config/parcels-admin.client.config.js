(function () {
  'use strict';

  // Configuring the Parcels Admin module
  angular
    .module('parcels.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Parcels',
      state: 'admin.parcels.list'
    });
  }
}());
