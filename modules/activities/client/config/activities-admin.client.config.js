(function () {
  'use strict';

  // Configuring the Products Admin module
  angular
    .module('activities.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Activities',
      state: 'admin.activities.list'
    });
  }
}());
