(function () {
  'use strict';

  angular
    .module('activities')
    .controller('ActivitiesListController', ActivitiesListController);

  ActivitiesListController.$inject = ['ActivitiesService'];

  function ActivitiesListController(ActivitiesService) {
    var vm = this;

    console.log('activities !!!');
    vm.activities = ActivitiesService.query().$promise.then(
      function(res){
        console.log('act res !!');
      },
      function(err){
        console.log('act err !!!');
      }
    );
    console.log('end activities !!!');
  }
}());
