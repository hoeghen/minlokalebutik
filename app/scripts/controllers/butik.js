'use strict';


angular.module('testappApp')
    .controller('ButikCtrl', function (dataService,$scope, $rootScope, $firebase, $http, $timeout, $filter, AlertService) {
        var ref = new Firebase($rootScope.firebaseref);
        var butikRef;
        var alleTilbud = $firebase(ref.child("alletilbud")).$asArray();

        $scope.alleTilbud = alleTilbud;

        Number.prototype.roundTo = function (n) {
            return Math.round(this / n) * n;
        }

        $rootScope.$watch('auth', function(newValue, oldValue) {
          if(newValue !== oldValue){
            if ($rootScope.auth && $rootScope.auth.uid) {
              butikRef = ref.child('users').child($rootScope.auth.uid).child("butik")
              $scope.butik = $firebase(butikRef).$asObject();
            }
          }
        });


        $scope.clearTilbud = function(){
          var weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate()+7);
          $scope.tilbud = {slut: weekFromNow}

        }

        $scope.getAlert = AlertService.getAlert;


        $scope.tabs = [
            {active: true},
            {active: false},
            {active: false},
        ];

        $scope.saveShop = function () {
            console.log("butik = " + $scope.butik);
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
            url = url + $scope.butik.adresse + "&sensor=false";
            console.log("URL =" + url);

            $http({method: 'GET', url: url}).
                success(function (data, status, headers, config) {
                    if (data.status == "OK") {
                        console.log("RESULT =" + data);
                        if(data.results.length == 0) {
                          AlertService.alert("kan ikke genkende adressen", "danger");
                        }
                        else if (data.results.length > 1) {
                            AlertService.alert("der er flere adresser der passer, vær mere specifik", "danger");

                        }else{

                         if (data.results[0].partial_match) {
                            AlertService.alert("butikkens adresse er ikke nøjagtig nok, vær mere specifik", "danger");

                          } else {
                                var butiklocation = data.results[0].geometry.location;
                                $scope.butik.position = butiklocation;
                                $scope.butik.$save();
                                AlertService.alert("butikken er gemt", "success", true);
                            }
                        }
                    } else {
                        if(data.status == "ZERO_RESULTS"){
                          AlertService.alert("Adressen kan ikke findes", "danger");
                        }else{
                          AlertService.alert("et eksternt system fungerer ikke, prøv igen senere", "danger");
                        }
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
            if(tilbud.$id){
              var item = alleTilbud.$getRecord(tilbud.$id);
              item.slut = angular.fromJson(angular.toJson(item.slut));
              $scope.clearTilbud();
              dataService.updateDistance(tilbud);
              alleTilbud.$save(item).then(function(ref){
                AlertService.alert("Dit tilbud er updateret", "success", true);
              },function(cause){
                AlertService.alert("Kunne ikke gemme dit tilbud", "error", true);
              });
            }else{
              tilbud.butik = $scope.butik;
              $scope.clearTilbud();
              tilbud.slut = angular.fromJson(angular.toJson(tilbud.slut));
              dataService.updateDistance(tilbud);
              alleTilbud.$add(tilbud).then(function(tilbudRef){
                if(!$scope.butik.tilbud){
                  $scope.butik.tilbud = [];
                }
                $scope.butik.tilbud.push(tilbudRef.key());
                saveButik();
              },function(reason){log.console("save tilbud failed:"+reason)});
            }

       }

    function saveButik() {
      $scope.butik.$save().then(
        function (data) {
          AlertService.alert("Dit tilbud er gemt", "success", true);
          $scope.clearTilbud();
        },
        function (err) {
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
            $scope.tilbud = alleTilbud.$getRecord($scope.butik.tilbud[index])
            $scope.tilbud.slut = new Date($scope.tilbud.slut);
        }
        $scope.remove = function (index) {
            var id = $scope.butik.tilbud[index].$id;
            var item = alleTilbud.$getRecord(id);
            alleTilbud.$remove(item)
            $scope.butik.tilbud.splice(index,1);
            $scope.butik.$save();
        }

        $scope.getTilbud = function(){
      var list = [];
      if($scope.butik && $scope.butik.tilbud){
        $scope.butik.tilbud.forEach(function(tilref){
          var tilbud = alleTilbud.$getRecord(tilref);
          list.push(tilbud);
        })
      }
      return list;
    }

    $scope.clearTilbud();
    $scope.types = dataService.getTilbudTypes();

  }); // end of controller def


