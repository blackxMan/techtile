(function () {
  'use strict';

  // Configuring the interventionNatures backoffice module
  angular
    .module('parameters.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Parameter',
      state: 'backoffice.parameters.list',
      icon:  'dashboard'
    });
  }
}());
