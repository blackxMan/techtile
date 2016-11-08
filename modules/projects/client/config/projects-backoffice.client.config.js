(function () {
  'use strict';

  // Configuring the projects backoffice module
  angular
    .module('projects.backoffice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Projects',
      state: 'backoffice.projects.list',
      icon:  'dashboard'
    });
  }
}());
