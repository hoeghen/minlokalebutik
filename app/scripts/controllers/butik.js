'use strict';


angular.module('testappApp')
    .controller('ButikCtrl', function ($scope, $rootScope, $firebaseAuth, $firebase, $http, $timeout,AlertService) {
        var ref = new Firebase('https://jobspot.firebaseio.com');

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
                            AlertService.alert("der er flere adresser der passer, vær mere specifik","error");

                            } else {
                            if (data.results[0].partial_match) {
                                AlertService.alert("butikkens adresse kan ikke findes på google maps, prøv en adresse tæt på","error");

                            } else {
                                var butiklocation = data.results[0].geometry.location;
                                $scope.butik.position = butiklocation;
                                $scope.butik.$save();
                                AlertService.alert("butikken er gemt");
                            }
                        }
                    } else {
                        AlertService.alert("et eksternt system fungerer ikke, prøv igen senere","error");
                        console.log(data.status + ":" + data.error_message);
                    }
                }).
                error(function (data, status, headers, config) {
                    AlertService.alert("butikkens adresse kan ikke findes på googlemaps","error");
                    console.log(data.status + ":" + data.error_message);
                });
        };
    });



