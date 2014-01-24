'use strict';


angular.module('testappApp')
  .controller('ButikCtrl', function ($scope, $rootScope, $firebaseAuth, $firebase, $http, flash) {
    var ref = new Firebase('https://jobspot.firebaseio.com');
    if ($rootScope.auth === null) {
      $rootScope.auth = $firebaseAuth(ref, {path: '/login'});
    }

    console.log('controller called');

    if ($rootScope.auth.user !== null) {
      $scope.butik = $firebase(ref).$child('users').$child($rootScope.auth.user.id).$child("butik");

    }

    function logResult(text) {
      flash(text);

      console.log(text);
    }

    $scope.saveShop = function () {
      console.log("butik = " + $scope.butik);


      var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
      url = url + $scope.butik.vejnavn + "," + $scope.butik.husnummer + "," + $scope.butik.postnummer + "&sensor=false";
      console.log("URL =" + url);

      $http({method: 'GET', url: url}).
        success(function (data, status, headers, config) {
          if (data.status == "OK") {
            console.log("RESULT =" + data);
            if (data.results.length > 1) {
              logResult("butikkens adresse kan ikke findes på google maps, vær mere specifik");
            } else {
              if (data.results[0].partial_match) {
                alert("butikkens adresse kan ikke findes på google maps, vær mere specifik");
                logResult("butikkens adresse kan ikke findes på google maps, vær mere specifik");

              } else {
                var butiklocation = data.results[0].geometry.location;
                $scope.butik.position = butiklocation;
                $scope.butik.$save();
                logResult("butikken er gemt");
              }
            }
          } else {
            logResult("butikkens adresse kan ikke findes på google maps, vær mere specifik");
            console.log(data.status + ":" + data.error_message);

          }
        }).
        error(function (data, status, headers, config) {
          logResult("butikkens adresse kan ikke findes på googlemaps, prøv en anden andresse eller en adresse tæt på");
          console.log(data.status + ":" + data.error_message);
        });

    };


  });



