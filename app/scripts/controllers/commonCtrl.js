'use strict';

angular.module('testappApp')
  .controller('CommonCtrl', function ($scope, $rootScope, $firebaseAuth, $firebase, $http) {

    $rootScope.alerts = [];


    $scope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

  });


