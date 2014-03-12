'use strict';


angular.module('testappApp')
  .controller('ButikCtrl', function ($scope, $rootScope, $firebaseAuth, $firebase, $http, $timeout, $filter, AlertService) {
    var ref = new Firebase('https://jobspot.firebaseio.com');

    Number.prototype.roundTo = function(n) {
      return Math.round(this / n) * n;
    }

    $scope.tilbud = {slut: $filter("date")(Date.now(), 'yyyy-MM-dd')};

    $scope.getAlert = AlertService.getAlert;

    if (!$rootScope.auth) {
      $rootScope.auth = $firebaseAuth(ref, {path: '/login'});
    }

    if ($rootScope.auth && $rootScope.auth.user) {
      $scope.butik = $firebase(ref).$child('users').$child($rootScope.auth.user.id).$child("butik");

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
              AlertService.alert("der er flere adresser der passer, vær mere specifik", "danger");

            } else {
              if (data.results[0].partial_match) {
                AlertService.alert("butikkens adresse kan ikke findes på google maps, prøv en adresse tæt på", "danger");

              } else {
                var butiklocation = data.results[0].geometry.location;
                $scope.butik.position = butiklocation;
                $scope.butik.tilbud = [];
                $scope.butik.$save();
                AlertService.alert("butikken er gemt", "success", true);
              }
            }
          } else {
            AlertService.alert("et eksternt system fungerer ikke, prøv igen senere", "danger");
            console.log(data.status + ":" + data.error_message);
          }
        }).
        error(function (data, status, headers, config) {
          AlertService.alert("butikkens adresse kan ikke findes på googlemaps", "danger");
          console.log(data.status + ":" + data.error_message);
        });
    };


    $scope.addTilbud = function () {
      var tilbud = $scope.tilbud;
      $scope.butik.tilbud.push(tilbud);
      $scope.butik.$save();
    }

    $scope.$watch('tilbud.forpris', function () {
      if ($scope.tilbud.pris > 0 && $scope.tilbud.forpris > 0) {
        $scope.tilbud.rabat = Number((($scope.tilbud.forpris - $scope.tilbud.pris) / $scope.tilbud.forpris * 100).toFixed(0));
      }
    });
    $scope.$watch('tilbud.pris', function () {
      if ($scope.tilbud.forpris > 0 && $scope.tilbud.forpris > 0) {
        if ($scope.active == 'pris') {
          $scope.tilbud.rabat = Number((($scope.tilbud.forpris - $scope.tilbud.pris) / $scope.tilbud.forpris * 100).toFixed(0));
        }
      }
    });
    $scope.$watch('tilbud.rabat', function () {
      if ($scope.tilbud.rabat > 0 && $scope.tilbud.forpris > 0) {
        if ($scope.active == "rabat") {
          $scope.tilbud.pris = Number(($scope.tilbud.forpris - $scope.tilbud.forpris * $scope.tilbud.rabat / 100).toFixed(2)).roundTo(0.25);

        }
      }
    });

    $scope.focus = function (element) {
      $scope.active = element;
    }

  });



