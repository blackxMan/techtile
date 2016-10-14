(function () {
  'use strict';

  angular
    .module('core')
    .factory('menuService', menuService);

  function menuService() {
    var shouldRender;
    var service = {
      addMenu: addMenu,
      addMenuItem: addMenuItem,
      addSubMenuItem: addSubMenuItem,
      defaultRoles: ['user', 'admin'],
      getMenu: getMenu,
      getMenus: getMenus,
      menus: [],
      removeMenu: removeMenu,
      removeMenuItem: removeMenuItem,
      removeSubMenuItem: removeSubMenuItem,
      validateMenuExistence: validateMenuExistence
    };

    init();

    return service;

    // Add new menu object by menu id
    function addMenu(menuId, options) {
      options = options || {};

      // Create the new menu
      service.menus.push({
        id: menuId,
        caption: options.caption,
        roles: options.roles || service.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      });

      // Return the menu object
      return service.menus[service.menus.length-1];
    }

    // Add menu item object
    function addMenuItem(menuId, options) {
      options = options || {};

      // Validate that the menu exists
      service.validateMenuExistence(menuId);


      var menu = service.validateMenuExistence(menuId);

      // Push new menu item
      menu.items.push({
        title: options.title || '',
        icon: options.icon || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? service.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          if (options.items.hasOwnProperty(i)) {
            service.addSubMenuItem(menuId, options.state, options.items[i]);
          }
        }
      }

      // Return the menu object
      return menu;
    }

    // Add submenu item object
    function addSubMenuItem(menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      var menu = service.validateMenuExistence(menuId);

      // Search for menu item
      for (var itemIndex in menu.items) {
        if (menu.items[itemIndex].state === parentItemState) {
          // Push new submenu item
          menu.items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            params: options.params || {},
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? menu.items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return menu;
    }

    // Get the menu object by menu id
    function getMenu(menuId) {

      // Return the menu object
      return service.validateMenuExistence(menuId);
    }

    // Get all menus
    function getMenus(){
      return service.menus;
    }



    function init() {
      // A private function for rendering decision
      shouldRender = function (user) {
        if (this.roles.indexOf('*') !== -1) {
          return true;
        } else {
          if (!user) {
            return false;
          }

          for (var userRoleIndex in user.roles) {
            if (user.roles.hasOwnProperty(userRoleIndex)) {
              for (var roleIndex in this.roles) {
                if (this.roles.hasOwnProperty(roleIndex) && this.roles[roleIndex] === user.roles[userRoleIndex]) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      };

      // Adding the topbar menu
      addMenu('topbar', {
        roles: ['*'],
        caption: 'Application'
      });
    }

    // Remove existing menu object by menu id
    function removeMenu(menuId) {
      // Validate that the menu exists
      var menu= service.validateMenuExistence(menuId);

      //delete menu;
    }

    // Remove existing menu object by menu id
    function removeMenuItem(menuId, menuItemState) {
      // Validate that the menu exists
      var menu = service.validateMenuExistence(menuId);

      // Search for menu item to remove
      for (var itemIndex in menu.items) {
        if (menu.items.hasOwnProperty(itemIndex) && menu.items[itemIndex].state === menuItemState) {
          menu.items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return menu;
    }

    // Remove existing menu object by menu id
    function removeSubMenuItem(menuId, submenuItemState) {
      // Validate that the menu exists
      var menu= service.validateMenuExistence(menuId);

      // Search for menu item to remove
      for (var itemIndex in menu.items) {
        if (menu.items.hasOwnProperty(itemIndex)) {
          for (var subitemIndex in menu.items[itemIndex].items) {
            if (menu.items[itemIndex].items.hasOwnProperty(subitemIndex) && menu.items[itemIndex].items[subitemIndex].state === submenuItemState) {
              menu.items[itemIndex].items.splice(subitemIndex, 1);
            }
          }
        }
      }

      // Return the menu object
      return menu;
    }

    // Validate menu existance
    function validateMenuExistence(menuId) {
      if (menuId && menuId.length) {
        var menu = _.find(service.menus,function(search){
          return search.id == menuId;
        });

        if (menu) {
          return menu;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
    }
  }
}());
