/**
 * Created by cha on 08-11-2014.
 */


angular.module('testappApp').factory('dataService', ['$firebase', '$rootScope','$filter','$http',function ($firebase, $rootScope,$filter,$http ) {
  var ref = new Firebase($rootScope.firebaseref);
  var position = {dirty:false,init:true};
  var manualPosition;
  var geoPosition;
  var ALLE_DISTANCER = 300000;
  var defaultFilter = {distance:ALLE_DISTANCER,rabat:0,dirty:false};
  var search = defaultFilter;
  var filteredResult = {view:[]};
  var firebaseArray;

  // Define a Position object
  function Position(lat,lng){
    this.coords = {};
    this.coords.latitude = lat;
    this.coords.longitude = lng;
  }


  // INIT
  initResult()

  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }

  function getAddress(location){
    if(location.currentPosition){
      var lat = location.currentPosition.coords.latitude;
      var lon = location.currentPosition.coords.longitude;
      var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + lon;

      $http({method: 'GET', url: url}).
        success(function (data) {
          var results = data.results;
          results.forEach(function(element){
            if(element.types.indexOf("postal_code") != -1){
              $rootScope.aktueltByNavn = element.address_components[1].short_name;
              $rootScope.aktueltPostnummer = element.address_components[0].short_name;
            }
          })
        }).
        error(function (data, status, headers, config) {
          console.log(data)
        });
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
      filteredResult.view = filterResult(firebaseArray);
      initGeoLocation();
    });
  }

  var onNewGeoLocation = function(position){
    geoPosition = position;
    $rootScope.$apply(updateView(position));
  }


  var updateView = function(newPosition){
    position.currentPosition = newPosition;
    position.dirty = !position.dirty;
    updateAllDistances();
    getAddress(position);
    filteredResult.view = filterResult(firebaseArray);
  }

  var stringContains = function (navn, text) {
    return navn.toLowerCase().indexOf(text.toLowerCase()) != -1;
  };

  function filterResult(fbArray){
    var filter;
    var list = fbArray;
    if(search.text){
      list = $filter('filter')(list, function(value,index){
        return stringContains(value.butik.navn,search.text) || stringContains(value.kort,search.text) || stringContains(value.lang,search.text)  || stringContains(value.pris.toString(),search.text);
      });
    }
    if(search.type && search.type != "Alle"){
      list =  $filter('filter')(list, {type:search.type});
    }
    if(search.rabat){
      list =  $filter('filter')(list, {rabat:search.rabat},biggerThan);
    }
    if((search.distance && position.currentPosition) || search.distance != ALLE_DISTANCER){
      list =  $filter('filter')(list, {distance:search.distance},lessThan);
    }
     if(search.butik){
       list =  $filter('filter')(list,function(value,index){
         return value.butik.navn == search.butik.navn;
       });
     }
    list = $filter('filter')(list,function(value,index){
      return new Date(value.slut) >= new Date();
    })
    list = $filter('filter')(list,function(value,index){
      return value.start == null || new Date(value.start) < new Date();
    })

    return list;
  }



  function initGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(onNewGeoLocation, handlePositionError);
    }
  }

  var getResults = function(){
    return filteredResult;
  }

  var updateDistance = function (tilbud) {
    if(position.currentPosition && tilbud){
      tilbud.distance = calculateDistance(position.currentPosition, tilbud.butik.position) ;
      tilbud.position = [tilbud.butik.position.lat,tilbud.butik.position.lng];
      tilbud.butik.distance = tilbud.distance;
    }
  }


  var updateAllDistances = function () {
      if(firebaseArray.length > 0){
        firebaseArray.forEach(updateDistance);
      }
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
    console.log("fallback to manual address")
  }

  var getTilbudTypes = function(){
    return [ "Hus","Have","Tøj","Sko","Mad og Drikke","Børn","Bil","Rejse","Elektronik","Service","Smykker","Kunst"];
  }

  var setSearch = function(newSearch){
    search = newSearch;
    search.dirty = true;
    filteredResult.view = filterResult(firebaseArray);
  }

  var getCurrentPosition = function(){
    return position;
  }

  var biggerThan = function(actual,expected){
    var result =  Number(actual) >= Number(expected);
    return result;
  };
  var lessThan = function(actual,expected){
    var result =  Number(actual) <= Number(expected);
    return result;
  };

  var sameObject = function(actual,expected){
    var result =  actual.name == expected.name;
    return result;
  };

  function tilbudTextSearch(actual,expected){
    var result =  actual.name == expected.name;
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


  // Any function returning a promise object can be used to load values asynchronously
  function getAdressMatches(matches,val, postcode) {

    var promise = getGeoCodeData(val,postcode);
    promise.then(function(result){
      matches =  result.data.results.map(function (item) {
        return item.formatted_address;
      });
    })
  }

  function getGeoCodeData(address,postcode){
    return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        sensor: false,
        components: getPostalCodeComponent(postcode) + "|country:DK"
      }
    })
  }

  function setManualLocation(address){
    if(address && address.length > 0){
      getGeoCodeData(address,null).
        then(function(result) {
          if(result.data.results.length > 0){
            var location = result.data.results[0].geometry.location;
            manualPosition = new Position(location.lat,location.lng);
            updateView(manualPosition);
          }else{
            updateView(geoPosition);
          }
        })
    }else{
        updateView(geoPosition);
    }
  }

  var getPostalCodeComponent = function (postcode) {
    if(postcode){
      return "postal_code:" + postcode;
    }else{
      return "";
    }
  };


  function setManualAdress(adresse){
    setManualLocation(adresse,null);
  }


  return {
    getFilteredResults: getResults,
    updateDistance : updateDistance,
    getTilbudTypes:getTilbudTypes,
    setSearch : setSearch,
    getCurrentPosition:getCurrentPosition,
    setManualAdress:setManualAdress,
    getAdressMatches:getAdressMatches,
    defaultFilter:defaultFilter
  };


}])
