(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', '$state', 'Authentication', 'menuService','$http'];

  function SidebarController($scope, $state, Authentication, menuService, $http) {
    var vm = this;

    //vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    //vm.menu = menuService.getMenu('topbar');
    vm.menus = menuService.getMenus();
    vm.signout= function(){
      vm.authentication.signout($http);
    }

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
