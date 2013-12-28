'use strict';

angular.module('testappApp')
  .controller('ButikCtrl', function ($scope,$rootScope,$firebaseAuth,$firebase) {
        var ref = new Firebase('https://jobspot.firebaseio.com');
        if($rootScope.auth == null){
            $rootScope.auth = $firebaseAuth(ref,{path:'/login'});
        }

        console.log("controller called")

        if($rootScope.auth.user != null){
            var refButik= $firebase(ref).$child('users').$child($rootScope.auth.user.id).$child("butik");
            $scope.butik = refButik;

        }



        $scope.saveShop = function(){
            console.log("butik = "+$scope.butik);




            $scope.butik.$save();
        };


  });



