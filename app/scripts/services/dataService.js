/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService',['$firebase','$rootScope','$firebaseSimpleLogin',function($firebase,$rootScope,$firebaseSimpleLogin){
  var ref = new Firebase('https://jobspot.firebaseio.com');
  if (!$rootScope.auth) {
    $rootScope.auth = $firebaseSimpleLogin(ref, {path: '/login'});
  }

  var sync = $firebase(ref);

  return {
      getButikForAuthUser : function(){
        return $firebase(ref).$child('users').$child($rootScope.auth.user.id).$child("butik");
      },

      getUsers : function(){
        return sync.$child('users');
      }

  };
  }])
