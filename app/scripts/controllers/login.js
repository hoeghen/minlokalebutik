'use strict';

angular.module('testappApp')
  .controller('LoginCtrl', function ($timeout,$rootScope, $scope, $firebaseAuth, $location,AlertService,$anchorScroll) {
    var ref = new Firebase($rootScope.firebaseref);
    $scope.getAlert = AlertService.getAlert;

    $scope.login = function () {
      var token = {email: $scope.user.email, password: $scope.user.password};
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.loginObj.$authWithPassword(token).then(handleLogin).catch(handleLoginError)
    };

    $scope.logout = function(){
      $rootScope.loginObj.$unauth();
      $rootScope.auth = null;
    }


    var handleLogin = function(user) {
        $rootScope.auth = $scope.loginObj.$getAuth();
        $('#loginModal').modal('hide')


      if ($rootScope.lastUrl) {
          $location.path($rootScope.lastUrl);
        } else {
            $location.path("home");
            $location.hash('butik');
            $anchorScroll();
        }
    }

    var handleLoginError = function(error) {
      log('Login failed: ', error);
    }

    $scope.create = function () {
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.loginObj.$createUser($scope.user.email, $scope.user.password).then(
        function () {
            log("Du er oprettet");
            AlertService.alert("Velkommen til min lokalebutik",'success',true);
            $scope.login();
          }).catch(function(error){
            console.log(error);
            log("Du kan ikke oprettes, prøv med en anden email/password kombination");
           });
    };

   function log(text) {
        AlertService.alert(text,'danger',true);
    }



  });


