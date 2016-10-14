(function () {
  'use strict';

  angular
    .module('activities.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.activities', {
        abstract: true,
        url: '/activities',
        template: '<ui-view/>'
      })
      .state('admin.activities.list', {
        url: '',
        templateUrl: 'modules/activities/client/views/admin/list-activities.client.view.html',
        controller: 'ActivitiesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.activities.create', {
        url: '/create',
        templateUrl: 'modules/activities/client/views/admin/form-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          activityResolve: newActivity
        }
      })
      .state('admin.activities.edit', {
        url: '/:activityId/edit',
        templateUrl: 'modules/activities/client/views/admin/form-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          activityResolve: getActivity
        }
      });
  }

  getActivity.$inject = ['$stateParams', 'ActivitiesService'];

  function getActivity($stateParams, ActivitiesService) {
    return ActivitiesService.get({
      activityId: $stateParams.activityId
    }).$promise;
  }

  newActivity.$inject = ['ActivitiesService'];

  function newActivity(ActivitiesService) {
    return new ActivitiesService();
  }
}());
