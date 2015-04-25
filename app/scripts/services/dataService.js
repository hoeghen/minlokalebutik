/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService', ['$firebase', '$rootScope','$filter',  function ($firebase, $rootScope,$filter ) {
  var ref = new Firebase($rootScope.firebaseref);
  var location = {};
  var search = {};
  var filteredResult = {view:[]};
  var firebaseArray;

  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }

  var initResult = function(){
    firebaseArray = $firebase(ref.child('alletilbud')).$asArray();
    firebaseArray.$loaded().then(function () {
      firebaseArray.forEach(function (tilbud) {
              tilbud.distance = "ukendt";
              tilbud.position = [1,1];
        }
      )
      getLocation(updateAllDistances);
      filteredResult.view = filterResult(firebaseArray,search);
    });
  }

  initResult();


  var filterResult = function(result,search){
    var filter;
    var filteredResult = result;
    if(search.text){
      filteredResult = $filter('filter')(filteredResult, search.text);
    }
    if(search.type && search.type != "Alle"){
      filteredResult =  $filter('filter')(filteredResult, {type:search.type});
    }
    if(search.rabat){
      filteredResult =  $filter('filter')(filteredResult, {rabat:search.rabat},biggerThan);
    }
    if(search.distance && location.currentPosition){
      filteredResult =  $filter('filter')(filteredResult, {distance:search.distance},lessThan);
    }
    return filteredResult;
  }

  var biggerThan = function(actual,expected){
    var result =  Number(actual) >= Number(expected);
    return result;
  };
  var lessThan = function(actual,expected){
    var result =  Number(actual) <= Number(expected);
    return result;
  };

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
        location.currentPosition = position;
        updateFunction();
      }, handlePositionError);
    }
  }

  var getResults = function(){
    return filteredResult;
  }

  var updateDistance = function (tilbud) {
    tilbud.distance = calculateDistance(location.currentPosition, tilbud.butik.position) ;
    tilbud.position = [tilbud.butik.position.lat,tilbud.butik.position.lng];
  }


  var updateAllDistances = function () {
    $rootScope.$apply(function(){
      firebaseArray.forEach(updateDistance);
    })

  }

  var handlePositionError = function (error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
      console.log(error.message)
    }
  }

  var getTilbudTypes = function(){
    return [ "Hus","Have","Tøj","Mad","Baby","Bil","Rejse","Elektronik","Service" ];
  }

  var setSearch = function(search){
    filteredResult.view  = filterResult(firebaseArray,search);
  }

  var getCurrentPosition = function(){
    return location;
  }

  return {
    getButikForAuthUser: function () {
      return $firebase(ref).$child('users').$child($rootScope.auth.uid).$child("butik");
    },
    getFilteredResults: getResults,
    calculateDistance : calculateDistance,
    getLocation : getLocation,
    updateDistance : updateDistance,
    getTilbudTypes:getTilbudTypes,
    setSearch : setSearch,
    getCurrentPosition:getCurrentPosition
  };


}])
