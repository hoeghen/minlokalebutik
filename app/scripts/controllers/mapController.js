/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('myMapController', function($scope,$rootScope,dataService) {

  var mapRef;
  $scope.list = dataService.getFilteredResults();
  $scope.$parent.selectMarker = selectMarker;
  $scope.location = dataService.getCurrentPosition();
  var lockMap = false;

  var circle;

  $scope.$watch('manueladresse', function () {
    dataService.setManualAdress($scope.manueladresse);
  });


//  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.$on('mapInitialized', function(event, map) {
    map.setOptions({disableDefaultUI:true,scrollwheel: false,zoomControl: true})
    mapRef = map;
    addMapClickEvent()
  });

  $scope.$watch('search',function(newValue, oldValue){
    lockMap = false;
    fitToCircle(newValue.distance,$scope.location);
  },true)

  //$scope.$watch('search.dirty',function(newValue, oldValue){
  //  $scope.search.dirty = false;
  //  fitToCircle($scope.search.distance,$rootScope.location);
  //  $scope.GenerateMapMarkers();
  //},true)
  //
  $scope.$watch('location.dirty',function(newValue, oldValue){
    if(!$scope.search.butik ){ // Dont update map if butik has been chosen or map is locked
      fitToCircle($scope.search.distance,$scope.location);
    }
  },false)


  $scope.clearMap = function(){
    alert("clearmap");
  }

  var fitToCircle = function(radius,location) {
    if (mapRef && !lockMap) {
      if(!circle){
        circle = mapRef.shapes.circle;
        google.maps.event.addListener(circle, 'click', function(){
          google.maps.event.trigger(mapRef, 'click', null);
        });

      }

      if(circle && radius && location.currentPosition){
        var center = new google.maps.LatLng(location.currentPosition.coords.latitude,location.currentPosition.coords.longitude);
        circle.setCenter(center);
        circle.setRadius(Number(radius));
        mapRef.fitBounds(circle.getBounds());
        mapRef.setZoom(mapRef.getZoom()+1);
      }
      $scope.GenerateMapMarkers();
    }

  }



  var markers = [];
  var infoWindow;
  $scope.GenerateMapMarkers = function() {
    var filteredTilbud = $scope.list.view;
    clearMarkers(markers);
    closeInfoWindow();

    filteredTilbud.forEach(function(tilbud){


      var marker = new google.maps.Marker({
        title: tilbud.butik.navn
      })

      marker.setPosition(tilbud.butik.position);
      marker.tilbud = tilbud;
      tilbud.marker = marker;
      infoWindow = createInfoWindow(marker);
      marker.setMap(mapRef)
      addClickEvent(marker);
      markers.push(marker)

    });
  };


  function addClickEvent(marker) {
    google.maps.event.addListener(marker, 'click', function(){
      mapRef.setCenter(marker.position);
      mapRef.setZoom(17);
      infoWindow.open(mapRef,marker);
      $rootScope.$apply(function(){
        $scope.search.butik = marker.tilbud.butik;
        dataService.setSearch($scope.search);
      });
    });
  }

  function addMapClickEvent() {
    google.maps.event.addListener(mapRef, 'click', function(){
      $rootScope.$apply(function() {
        $scope.search.butik = null;
        $scope.search.dirty = !$scope.search.dirty;
      })
      fitToCircle($scope.search.distance,$scope.location);
    });
  }

  function selectMarker (tilbud) {
      mapRef.setCenter(tilbud.marker.position);
      mapRef.setZoom(17);
      infoWindow.close();
      infoWindow = createInfoWindow(tilbud.marker);
      infoWindow.open(mapRef,tilbud.marker);
      lockMap = true;
  }


  function clearMarkers(markers) {
    while(markers.length){
      markers.pop().setMap(null);
    }
  }

  function closeInfoWindow() {
    if(infoWindow) {
      infoWindow.close();
    }
  }

  function createInfoWindow(marker) {
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<div id="bodyContent">'+
      '<p><b>'+marker.tilbud.butik.navn+'</b></p>' +
      '<p> Adresse: ' + marker.tilbud.butik.adresse+'</p>'+
      '<p> Afstand: ' + marker.tilbud.butik.distance+ ' meter</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    return infowindow;
  }



})

