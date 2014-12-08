'use strict';

angular.module('testappApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $firebaseAuth, $location,AlertService,$anchorScroll) {
    var ref = new Firebase($rootScope.firebaseref);
    $scope.getAlert = AlertService.getAlert;

    $scope.login = function () {
      var token = {email: $scope.user.email, password: $scope.user.password};
      $scope.loginObj = $firebaseAuth(ref);
      $scope.loginObj.$authWithPassword(token).then(handleLogin).catch(handleLoginError)
    };

    var handleLogin = function(user) {
        log('Logged in as: ' + user.uid);
        $rootScope.auth = $scope.loginObj.$getAuth();
        if ($rootScope.lastUrl) {
          $location.path($rootScope.lastUrl);
        } else {
          $location.hash('butik');
          $anchorScroll();
        }
        $('#loginModal').modal('hide')
    }

    var handleLoginError = function(error) {
      log('Login failed: ', error);
    }


    $scope.create = function () {
      $scope.loginObj.$createUser($scope.user.email, $scope.user.password,
        function (error, user) {
          if (!error) {
            log("Du er oprettet");
          }else{
            log("Du kan ikke oprettes, prøv med en anden email/password kombination");
          }
        });
    };
    $scope.logout = function () {
      $scope.loginObj.$unauth();
    };


    $scope.redirect = function () {
      $location.path('/browse');
    };

    function log(text) {
        AlertService.alert(text,'danger',true);
    }


  });


