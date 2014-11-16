'use strict';

angular.module('testappApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $firebaseSimpleLogin, $location,AlertService) {
    var ref = new Firebase($rootScope.firebaseref);
    $scope.loginObj = $firebaseSimpleLogin(ref);


    $scope.login = function () {
      $scope.loginObj.$login("password", {email: $scope.user.email, password: $scope.user.password}).then(
        function (user) {
          log('Logged in as: ' +  user.uid);
          $rootScope.auth = $scope.loginObj;
          if($rootScope.lastUrl){
            $location.path($rootScope.lastUrl);
          }
          $scope.loginStyle = {display:'none'};
        },
        function (error) {
        log('Login failed: ', error);
        })
    };

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
      $scope.loginObj.$logout();
    };


    $scope.redirect = function () {
      $location.path('/browse');
    };

    function log(text) {
        AlertService.alert(text, true);

    }


  });


