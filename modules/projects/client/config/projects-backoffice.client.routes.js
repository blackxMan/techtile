(function () {
  'use strict';

  angular
    .module('projects.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.projects.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/projects/client/views/backoffice/list-projects.client.view.html',
            controller: 'ProjectsListController',
            controllerAs: 'vm',
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        }
      })
      .state('backoffice.projects.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/projects/client/views/backoffice/form-project.client.view.html',
            controller: 'ProjectsController',
            controllerAs: 'vm',
            resolve: {
              projectResolve: newProject
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },
      })
      .state('backoffice.projects.edit', {
        url: '/:projectId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/projects/client/views/backoffice/form-project.client.view.html',
            controller: 'ProjectsController',
            controllerAs: 'vm',
            resolve: {
              projectResolve: getProject
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },

      });
  }

  getProject.$inject = ['$stateParams', 'ProjectsService'];

  function getProject($stateParams, ProjectsService) {
    return ProjectsService.get({
      projectId: $stateParams.projectId
    }).$promise;
  }

  newProject.$inject = ['ProjectsService'];

  function newProject(ProjectsService) {
    var project = new ProjectsService();
    return project;
  }
}());
