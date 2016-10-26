(function () {
  'use strict';

  // Configuring the interventionNatures backoffice module
  angular
    .module('interventionNatures.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Intervention Natures',
      state: 'backoffice.interventionNatures.list',
      icon:  'dashboard'
    });
  }
}());
