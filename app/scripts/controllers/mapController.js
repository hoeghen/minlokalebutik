/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('myMapController', function($scope,dataService) {

  var mapRef;
  $scope.list = dataService.getFilteredResults();
  $scope.location = dataService.getCurrentPosition();

//  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.$on('mapInitialized', function(event, map) {
    map.setOptions({disableDefaultUI:true,scrollwheel: true})
    mapRef = map;
  });


  $scope.$watch('search.distance',function(newValue, oldValue){
    fitToCircle(newValue,$scope.location);
    $scope.GenerateMapMarkers();
  },true)

  $scope.$watch('search.dirty',function(newValue, oldValue){
    $scope.search.dirty = false;
    $scope.GenerateMapMarkers();
  },true)

  $scope.$watch('location',function(newValue, oldValue){
    fitToCircle($scope.search.distance,newValue);
    $scope.GenerateMapMarkers();
  },false)

  var fitToCircle = function(radius,location) {
    if (mapRef) {
      var circle = mapRef.shapes.circle;
      var position = location.currentPosition;
      if(circle && radius && position){
        var center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        circle.setCenter(center);
        circle.setRadius(Number(radius));
        mapRef.fitBounds(circle.getBounds());
        mapRef.setZoom(mapRef.getZoom()+1);
      }
    }

  }

  $scope.clickedMarker = function(event,index){
    alert("clicked "+ index);

  }

  var markers = [];

  $scope.GenerateMapMarkers = function() {
    var filteredTilbud = $scope.list.view;
    clearMarkers(markers);

    filteredTilbud.forEach(function(tilbud){
      var marker = new google.maps.Marker({
        title: tilbud.butik.navn
      })
      var infoWindow = createInfoWindow(marker,tilbud);
      addClickEvent(marker,tilbud,infoWindow);

      marker.setPosition(tilbud.butik.position);
      marker.setMap(mapRef)
      markers.push(marker)
    });
  };


  function addClickEvent(marker, tilbud,infowindow) {
    google.maps.event.addListener(marker, 'click', function() {
      mapRef.setCenter(marker.position);
      mapRef.setZoom(17);
      infowindow.open(mapRef,marker);
    });
  }

  function clearMarkers(markers) {
    while(markers.length){
      markers.pop().setMap(null);
    }
  }

  function createInfoWindow(marker, tilbud) {
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<div id="bodyContent">'+
      '<p><b>'+tilbud.butik.navn+'</b></p>' +
      '<p> Adresse: ' + tilbud.butik.adresse+'</p>'+
      '<p> Afstand: ' + tilbud.butik.distance+ ' meter</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    return infowindow;
  }



})

