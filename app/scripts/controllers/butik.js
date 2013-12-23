'use strict';

angular.module('testappApp')
  .controller('ButikCtrl', function ($scope,$rootScope,$firebaseAuth,$firebase) {
        var ref = new Firebase('https://jobspot.firebaseio.com');
        if($rootScope.auth == null){
            $rootScope.auth = $firebaseAuth(ref,{path:'/login'});
        }
        var user = $firebase(ref).$child('users').$child($rootScope.auth.user.id);
        $scope.butik = user.$child('butik');


        $scope.saveShop = function(){

        };


  });



