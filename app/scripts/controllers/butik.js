'use strict';


angular.module('testappApp')
    .controller('ButikCtrl', function ($scope, $rootScope, $firebaseSimpleLogin, $firebase, $http, $timeout, $filter, AlertService) {
        var ref = new Firebase($rootScope.firebaseref);

        Number.prototype.roundTo = function (n) {
            return Math.round(this / n) * n;
        }
        clearTilbud();


        function clearTilbud(){
          $scope.tilbud = {slut: new Date()};
        }

        $scope.getAlert = AlertService.getAlert;

        if ($rootScope.auth && $rootScope.auth.user) {
          var butikRef = $firebase(ref.child('users').child($rootScope.auth.user.id).child("butik"));
          $scope.butik = butikRef.$asObject();
        }

        $scope.tabs = [
            {active: true},
            {active: false},
            {active: false},
        ];

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
            if(!$scope.butik.tilbud){
              $scope.butik.tilbud = [];
            }
            var tilbud = $scope.tilbud;
            tilbud = angular.fromJson(angular.toJson(tilbud));
            if(tilbud.index==null){
              $scope.butik.tilbud.push(tilbud);
            }else{
              $scope.butik.tilbud[tilbud.index] = tilbud;
              delete tilbud.index;
            }
            $scope.butik.$save().then(
              function(data){
                AlertService.alert("Dit tilbud er gemt", "success", true);
                clearTilbud();
              },
              function(err){
                AlertService.alert("Dit tilbud kunne ikke gemmes, prøv igen", "error", true);
              }
            );
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

        $scope.edit = function (index) {
            $scope.tabs[1].active = true;
            $scope.tilbud = $scope.butik.tilbud[index];
            $scope.tilbud.slut = new Date($scope.tilbud.slut);
            $scope.tilbud.index = index;
        }
        $scope.remove = function (index) {
            $scope.butik.tilbud.splice(index,1);
            $scope.butik.$save();
        }
    });


