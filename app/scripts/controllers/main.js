'use strict';

angular.module('testappApp');

angular.module('testappApp').controller('MainCtrl', function($modal,$rootScope,$scope,firebaseService) {

  var modalInstance;
  $scope.openEmail = function (size) {
    $scope.tilbudEmail;

    modalInstance = $modal.open({
      templateUrl: 'views/tilbudsmailmodel.html',
      scope: $scope
    });
  };

  $scope.gemEmail = function(){
    if($scope.emailform.$valid){
      firebaseService.saveTilbudsEmail($scope.tilbudEmail,$rootScope.aktueltPostnummer,$rootScope.aktueltByNavn)
      $scope.$close();
    }else{
      alert("ugyldig email");
    }
  }

  $scope.removeEmail = function(){
    if($scope.stopEmail.$valid){
      firebaseService.removeTilbudsEmail($scope.email)
    }else{
      alert("ugyldig email");
    }
  }

});

