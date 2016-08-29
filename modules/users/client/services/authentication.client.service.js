(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user,
      signout: signout,
      loadCredentials: loadCredentials,
      persistCredentials: persistCredentials
    };

    function signout($http){
      $http.get('/api/auth/signout').then(function(res){
          console.log('user disconnected succesfully');
          auth.user = undefined;
          localStorage.clear();
          window.location = '/authentication/signin';
        },function(err){
          console.log('err while disconnecting user');
        });
      console.log('signout !!');
    }

    function loadCredentials(){
      if(localStorage.getItem('token') != undefined){
        auth.user = {token: localStorage.getItem('token'), displayName: localStorage.getItem('displayName'), profileImageURL: localStorage.getItem('profileImageURL'),roles: JSON.parse(localStorage.getItem('roles'))};
      }
    }

    function persistCredentials(credentials){
      localStorage.setItem('token',credentials.token);
      localStorage.setItem('roles',JSON.stringify(credentials.roles));
      localStorage.setItem('displayName',credentials.displayName);
      localStorage.setItem('profileImageURL',credentials.profileImageURL);
    }

    return auth;
  }
}());
