/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('myMapController', function($scope,$rootScope,dataService,$timeout) {

  var mapRef;
  $scope.list = dataService.getFilteredResults();
  $scope.location = dataService.getCurrentPosition();
  var lockMap = false;
  var circle;

  $scope.$watch('manueladresse', function () {
    dataService.setManualAdress($scope.manueladresse);
  });




  $scope.$on('mapInitialized', function(event, map) {
    lockMap = false;
    map.setOptions({disableDefaultUI:true,scrollwheel: false,zoomControl: true})
    mapRef = map;
    addMapClickEvent();
  });

  // Triggeren when a distance button is hit

  $scope.$watch('search',function(newValue, oldValue){
    lockMap = false
    if($scope.location.currentPosition){
      fitToCircle(newValue.distance,getCenter());
    }

  },true)

  $scope.$watch('location.dirty',function(newValue, oldValue){
    if(!$scope.search.butik && !lockMap){ // Dont update map if butik has been chosen or map is locked
      fitToCircle($scope.search.distance,getCenter());
    }
  },false)

  var lastRadius,lastCenter;

  var fitToCircle = function(radius,center) {
    isFitting = true;
    if (mapRef) {
      if(!circle) {
        circle = mapRef.shapes.circle;
        google.maps.event.addListener(circle, 'click', function () {
          google.maps.event.trigger(mapRef, 'click', null);
        });
      }
      var somethingHasChanged = false;


      if(lastRadius==null || lastRadius != radius) {
        circle.setRadius(Number(radius));
        lastRadius = radius;
        somethingHasChanged = true;
      }
      if(lastCenter == null || !lastCenter.equals(center)) {
        circle.setCenter(center);
        somethingHasChanged = true;
        lastCenter = center;
      }
      if(somethingHasChanged){
        // Fit bounds is async
        var zoom_level = mapRef.getZoom();
        google.maps.event.addListenerOnce(mapRef, 'bounds_changed', function(event) {
          zoom_level =  mapRef.getZoom();
          google.maps.event.addListenerOnce(mapRef,"zoom_changed",function(event){
            zoom_level =  mapRef.getZoom();
          })
          mapRef.setZoom(zoom_level+1);
        });
        mapRef.fitBounds(circle.getBounds());

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
      fitToCircle(100,marker.position);
      infoWindow.open(mapRef,marker);
      $rootScope.$apply(function(){
        $scope.search.butik = marker.tilbud.butik;
        dataService.setSearch($scope.search);
      });
    });
  }

  function addMapClickEvent() {
    if(mapRef){
      google.maps.event.clearListeners(mapRef,'click');

      google.maps.event.addListener(mapRef, 'click', function(){
        $rootScope.$apply(function() {
          $scope.search.butik = null;
          $scope.search.dirty = !$scope.search.dirty;
          fitToCircle($scope.search.distance,getCenter());
        })

      });
    }
  }

  $rootScope.$on("onMarkerSelected", function (event,tilbud) {
    fitToCircle(100,tilbud.marker.position)
    infoWindow.close();
    infoWindow = createInfoWindow(tilbud.marker);
    infoWindow.open(mapRef,tilbud.marker);
    lockMap = true;
  })

  $rootScope.$on("onMarkerDeSelected", function (event,tilbud) {
    fitToCircle($scope.search.distance,getCenter());
    infoWindow.close();
    lockMap = false;
  })


  function clearMarkers(markers) {
    while(markers.length){
      var marker = markers.pop();
      marker.setMap(null);
      google.maps.event.clearListeners(marker,'click');
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

  function getCenter() {
    var center = new google.maps.LatLng($scope.location.currentPosition.coords.latitude, $scope.location.currentPosition.coords.longitude);
    return center;
  }



})

