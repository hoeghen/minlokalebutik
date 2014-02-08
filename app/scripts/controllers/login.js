'use strict';

angular.module('testappApp')
  .controller('LoginCtrl', function ($rootScope, $scope, $firebaseAuth, $location) {



    $rootScope.$on("$firebaseAuth:logout", function () {
      log("User is logged out");
    });


    $scope.login = function () {
      $rootScope.auth.$login("password", {email: $scope.user.email, password: $scope.user.password}).then(function (user) {
        log('Logged in as: ', user.uid);
      }, function (error) {
        log('Login failed: ', error);
      })
    };

    $scope.testLogin = function () {
      $rootScope.auth.$login("password", {email: 'carverdk@gmail.com', password: 'wobler'}).then(function (user) {
        log("Du er logget på som " + user.email);
      }, function (error) {
        log('Login failed: ', error);
      });
    };


    $scope.create = function () {
      $rootScope.auth.$createUser($scope.user.email, $scope.user.password,
        function (error, user) {
          if (!error) {
            log("Du er oprettet");
          }else{
            log("Du kan ikke oprettes, prøv med en anden email/password kombination");
          }
        });
    };
    $scope.logout = function () {
      $rootScope.auth.$logout();
      $location.path('/');
    };


    $scope.redirect = function () {
      $location.path('/browse');
    };

    function log(text) {
      alert(text);
      console.log(text);
    }


  });


