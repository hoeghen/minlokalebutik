/**
 * Created by cha on 12/27/2014.
 */
angular.module('testappApp').controller('mapController', function($scope,dataService) {

  var mapRef;
  $scope.list = dataService.getFilteredResults();
  $scope.location = dataService.getCurrentPosition();

//  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.$on('mapInitialized', function(event, map) {
    map.setOptions({disableDefaultUI:true,scrollwheel: false})
    mapRef = map;
  });


  $scope.$watch('search.distance',function(newValue, oldValue){
    fitToCircle(newValue,$scope.location);
  },true)

  $scope.$watch('location',function(newValue, oldValue){
    fitToCircle($scope.search.distance,newValue);
  },true)

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

})

