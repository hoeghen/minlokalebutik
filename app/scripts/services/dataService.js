/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService', ['$firebase', '$rootScope',  function ($firebase, $rootScope) {
  var ref = new Firebase($rootScope.firebaseref);
  var alleTilbud = [];
  var currentPosition;

  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }

  var getAlleTilbud = function(){
    alleTilbud = $firebase(ref.child('alletilbud')).$asArray();
    alleTilbud.$loaded().then(function () {
      alleTilbud.forEach(function (tilbud) {
              tilbud.distance = "ukendt";
        }
      )
      getLocation(updateAllDistances);
    });
    return alleTilbud;
  }

  var calculateDistance = function(p1, p2) { // Points are Geolocation.coords objects
    var R = 6371; // earth's mean radius in km
    var dLat  = (p2.lat - p1.coords.latitude).toRad();
    var dLong = (p2.lng - p1.coords.longitude).toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(p1.coords.latitude.toRad()) * Math.cos(p2.lat.toRad()) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3)*1000;
  }


  var getLocation = function(updateFunction) {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        currentPosition = position;
        updateFunction();
      }, handlePositionError);
    }
  }


  var updateDistance = function (tilbud) {
    tilbud.distance = calculateDistance(currentPosition, tilbud.butik.position) + "m" ;
  }

  var updateAllDistances = function () {
    $rootScope.$apply(function(){
      alleTilbud.forEach(updateDistance);
    })

  }

  var handlePositionError = function (error) {
    console.log("Position Error:" + error);
  }

  if (navigator.geolocation) {
  }




  return {
    getButikForAuthUser: function () {
      return $firebase(ref).$child('users').$child($rootScope.auth.uid).$child("butik");
    },
    getTilbud: getAlleTilbud,
    calculateDistance : calculateDistance,
    getLocation : getLocation
  };


}])
