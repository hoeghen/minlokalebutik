'use strict';

angular.module('testappApp')
  .controller('LoginCtrl', function ($modal,$timeout,$rootScope, $scope, $firebaseAuth, $location,AlertService,$anchorScroll) {
    var ref = new Firebase($rootScope.firebaseref);
    $scope.getAlert = AlertService.getAlert;

    var modalInstance;
    $scope.open = function (size) {
      modalInstance = $modal.open({
        templateUrl: 'views/loginModal.html'
      });
    };




    $scope.login = function () {
      var token = {email: $scope.user.email, password: $scope.user.password};
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.busy = true;
      $rootScope.loginObj.$authWithPassword(token).then(handleLogin).catch(handleLoginError)
    };

    $scope.logout = function(){
      $rootScope.loginObj.$unauth();
      $rootScope.auth = null;
    }


    var handleLogin = function(user) {
        $rootScope.auth = $scope.loginObj.$getAuth();
        $scope.$close();


      if ($rootScope.lastUrl) {
          $location.path($rootScope.lastUrl);
        } else {
            $location.path("home");
            $location.hash('butik');
            $anchorScroll();
        }
      $rootScope.busy = false;
    }

    var handleLoginError = function(error) {
      log('Login failed: ', error);
      $rootScope.busy = false;
    }

    $scope.create = function () {
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.loginObj.$createUser($scope.user.email, $scope.user.password).then(
        function () {
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


