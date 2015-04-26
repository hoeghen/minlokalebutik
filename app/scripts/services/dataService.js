/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService', ['$firebase', '$rootScope','$filter',  function ($firebase, $rootScope,$filter ) {
  var ref = new Firebase($rootScope.firebaseref);
  var geoLocation = {};
  var search = {distance:1000};
  var filteredResult = {view:[]};
  var firebaseArray;

  // INIT
  initResult()




  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }



  function initResult(){
    firebaseArray = $firebase(ref.child('alletilbud')).$asArray();
    firebaseArray.$loaded().then(function () {
      firebaseArray.forEach(function (tilbud) {
              tilbud.distance = "ukendt";
              tilbud.position = [1,1];
        }
      )
      initGeoLocation();
    });
  }

  function onNewPosition(){
    updateAllDistances();
    $rootScope.$apply(function(){
      filteredResult.view = filterResult(firebaseArray);
    });
  }



   function filterResult(fbArray){
    var filter;
    var list = fbArray;
    if(search.text){
      list = $filter('filter')(list, search.text);
    }
    if(search.type && search.type != "Alle"){
      list =  $filter('filter')(list, {type:search.type});
    }
    if(search.rabat){
      list =  $filter('filter')(list, {rabat:search.rabat},biggerThan);
    }
    if(search.distance && geoLocation.currentPosition){
      list =  $filter('filter')(list, {distance:search.distance},lessThan);
    }
    return list;
  }



  function initGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        geoLocation.currentPosition = position;
        onNewPosition()
      }, handlePositionError);
    }
  }

  var getResults = function(){
    return filteredResult;
  }

  var updateDistance = function (tilbud) {
    if(geoLocation.currentPosition && tilbud){
      tilbud.distance = calculateDistance(geoLocation.currentPosition, tilbud.butik.position) ;
      tilbud.position = [tilbud.butik.position.lat,tilbud.butik.position.lng];
    }
  }


  var updateAllDistances = function () {
      if(firebaseArray.length > 0){
        firebaseArray.forEach(updateDistance);
      }
  }

  function handlePositionError(error) {
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

  var setSearch = function(newSearch){
    search = newSearch;
    filteredResult.view = filterResult(firebaseArray);
  }

  var getCurrentPosition = function(){
    return geoLocation;
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


  return {
    getFilteredResults: getResults,
    updateDistance : updateDistance,
    getTilbudTypes:getTilbudTypes,
    setSearch : setSearch,
    getCurrentPosition:getCurrentPosition
  };


}])
