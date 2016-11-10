(function () {
  'use strict';

  angular
    .module('projects.backoffice')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['ProjectsService','$http','$state','$scope'];

  function ProjectsListController(ProjectsService,$http,$state,$scope) {
    var vm = this;

    $scope.pageTitle = "Projects";

    vm.selectedItems = [];

    vm.dtConfig = {
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(result) {
      vm.projects = result.data;
      console.log('success');
    }

    function error(err){
      console.log('error !!');
    }

    /**
    * get the list of items
    */
    vm.getProjects = function () {
      vm.promise = $http.get('/api/lazy/projects',{params:vm.dtConfig}).then(success,error).$promise;
    };

    /**
    * Open the edit form
    */
    vm.edit= function(projectId){
      $state.go('backoffice.projects.edit',{projectId: projectId});
    }

    /**
    * delete one or selected item
    */
    vm.deleteItems= function(itemToDelete){
      var selectedIds= [];

      if(itemToDelete){
        selectedIds.push(itemToDelete);
      }else{
        _.each(vm.selectedItems,function(item){
          selectedIds.push(item.id);
        });
      }


      $http.post('api/ajax/projects/delete/all',{itemsToDelete: selectedIds})
        .then(function(res){
          vm.selectedItems = [];
          vm.getProjects();
        },function(err){
          console.log(err);
        });

    }
  }
}());
