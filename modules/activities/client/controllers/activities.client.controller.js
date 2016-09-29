(function () {
  'use strict';

  angular
    .module('activities')
    .controller('ActivitiesController', ActivitiesController);

  ActivitiesController.$inject = ['$scope', 'activityResolve', 'Authentication'];

  function ActivitiesController($scope, activity, Authentication) {
    var vm = this;

    vm.activity = activity;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
