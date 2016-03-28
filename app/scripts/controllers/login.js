'use strict';
angular.module('testappApp')
  .controller('LoginCtrl', function ($modal,$timeout,$rootScope, $scope, $firebaseAuth, $location,AlertService,$anchorScroll,$localStorage) {
    var ref = new Firebase($rootScope.firebaseref);
    $scope.getAlert = AlertService.getAlert;
    $scope.showReset = false;

    var modalInstance;
    $scope.open = function (size) {
      $scope.user = {};
      $scope.showReset = false;
      if($localStorage.remember){
        $scope.user.email = $localStorage.email;
        $scope.user.password = $localStorage.password;
        $scope.user.remember = true;
      }

      modalInstance = $modal.open({
        templateUrl: 'views/loginModal.html',
        scope: $scope
      });
    };

    $scope.showResetPassword= function(){
      $scope.showReset = true;
    }

    $scope.resetPassword= function(){
      $scope.showReset = false;
      $scope.$close();
      $firebaseAuth(ref).$sendPasswordResetEmail($scope.user.email);
    }

    $scope.newPassword = function(){
      var email = $location.search().email;
      var tempToken = $location.search().token;

      var token = {email: email, password: tempToken};
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.busy = true;
      $rootScope.loginObj.$authWithPassword(token)
        .then(function (user) {
          $rootScope.auth = $scope.loginObj.$getAuth();
          $scope.loginObj.$changePassword(email,tempToken, $scope.user.newpassword)
            .then(function () {
              AlertService.alert("Dit password er ændret",'success',true);
              $rootScope.busy = false;
            })
            .catch(function (error) {
              log("ændringen af dit password er fejlet, send en ny reset password email:" + error);
              $rootScope.busy = false;
            })
        })
        .catch( handleLoginError);
    }

    $scope.login = function () {
      var token = {email: $scope.user.email, password: $scope.user.password};
      $rootScope.loginObj = $firebaseAuth(ref);
      $rootScope.busy = true;
      try{
        $rootScope.loginObj.$authWithPassword(token).then(handleLogin).catch(function(error){
          log('Login failed: ', error);
          $rootScope.busy = false;
        })
      }catch(error){
        log('Login failed: ', error);
        $rootScope.busy = false;
      }
    };

    $scope.logout = function(){
      $rootScope.loginObj.$unauth();
      $rootScope.auth = null;
    }


    var handleLogin = function(user) {
      $rootScope.auth = $scope.loginObj.$getAuth();

      if($scope.user.remember){
        $localStorage.email = $scope.user.email;
        $localStorage.password = $scope.user.password;
        $localStorage.remember = $scope.user.remember;
      }else{
        $localStorage.email = undefined;
        $localStorage.password = undefined;
        $localStorage.remember = false;
      }
      $scope.$close();

    if ($rootScope.lastUrl) {
          $location.path($rootScope.lastUrl);
        } else {
            $location.path("/home");
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


