(function () {
  'use strict';

  angular
    .module('projects.backoffice')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', '$window', 'projectResolve', 'Authentication','$http','$q','ProjectsService','ClientsService'];

  function ProjectsController($scope, $state, $window, project, Authentication, $http, $q, ProjectsService, ClientsService) {
    var vm = this;

    vm.project = project;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.searchClient   = null;
    vm.clientSearch   = clientSearch;

    vm.clientChange    = clientChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for clients...
     * remote dataservice call.
     */
    function clientSearch (searchToken) {
      return $http.get('/api/ajax/clients/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }


    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.project.$remove(
          function(res){
            $state.go('backoffice.projects.list')
          },
          function(err){
            console.log('err projects');
          }
        );

      }
    }

    function clientChange(item){
      if(item)
        vm.project.client_id = item.id;
      else
        vm.project.client_id = null;
    }

    // Save Project
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // Create a new project, or update the current instance
      vm.project.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.projects.list'); // should we send the User to the list or the updated project's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
